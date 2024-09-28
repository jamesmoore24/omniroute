import torch
from huggingface_hub import PyTorchModelHubMixin
import abc

from utils import OPENAI_CLIENT
from utils import MODEL_IDS



def no_parallel(cls):
    cls.NO_PARALLEL = True

    return cls

class Router(abc.ABC):
    NO_PARALLEL = False

    # Returns a float between 0 and 1 representing the value used to route to models, conventionally the winrate of the strong model.
    # If this value is >= the user defined cutoff, the router will route to the strong model, otherwise, it will route to the weak model.
    @abc.abstractmethod
    def calculate_strong_win_rate(self, prompt):
        pass

    def route(self, prompt, threshold, routed_pair):
        if self.calculate_strong_win_rate(prompt) >= threshold:
            return routed_pair.strong
        else:
            return routed_pair.weak

@no_parallel
class MatrixFactorizationRouter(Router):
    def __init__(
        self,
        checkpoint_path,
        # This is the model pair for scoring at inference time,
        # and can be different from the model pair used for routing.
        strong_model="gpt-4-1106-preview",
        weak_model="mixtral-8x7b-instruct-v0.1",
        hidden_size=128,
        num_models=64,
        text_dim=1536,
        num_classes=1,
        use_proj=True,
    ):
        device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
        #device = torch.device("cpu")

        self.model = MFModel.from_pretrained(
            checkpoint_path,
            dim=hidden_size,
            num_models=num_models,
            text_dim=text_dim,
            num_classes=num_classes,
            use_proj=use_proj,
        )
        self.model = self.model.eval().to(device)
        self.strong_model_id = MODEL_IDS[strong_model]
        self.weak_model_id = MODEL_IDS[weak_model]

    def calculate_strong_win_rate(self, prompt):
        winrate = self.model.pred_win_rate(
            self.strong_model_id, self.weak_model_id, prompt
        )
        return winrate

class MFModel(torch.nn.Module, PyTorchModelHubMixin):
    def __init__(
        self,
        dim,
        num_models,
        text_dim,
        num_classes,
        use_proj,
    ):
        super().__init__()
        self._name = "TextMF"
        self.use_proj = use_proj
        self.P = torch.nn.Embedding(num_models, dim)

        self.embedding_model = "text-embedding-3-small"

        if self.use_proj:
            self.text_proj = torch.nn.Sequential(
                torch.nn.Linear(text_dim, dim, bias=False)
            )
        else:
            assert (
                text_dim == dim
            ), f"text_dim {text_dim} must be equal to dim {dim} if not using projection"

        self.classifier = torch.nn.Sequential(
            torch.nn.Linear(dim, num_classes, bias=False)
        )

    def get_device(self):
        return self.P.weight.device

    def forward(self, model_id, prompt):
        model_id = torch.tensor(model_id, dtype=torch.long).to(self.get_device())

        model_embed = self.P(model_id)
        model_embed = torch.nn.functional.normalize(model_embed, p=2, dim=1)

        prompt_embed = (
            OPENAI_CLIENT.embeddings.create(input=[prompt], model=self.embedding_model)
            .data[0]
            .embedding
        )
        prompt_embed = torch.tensor(prompt_embed, device=self.get_device())
        prompt_embed = self.text_proj(prompt_embed)

        # Elementwise multiplication of model_embed and prompt_embed increases variance?
        return self.classifier(model_embed * prompt_embed).squeeze()

    @torch.no_grad()
    def pred_win_rate(self, model_a, model_b, prompt):
        logits = self.forward([model_a, model_b], prompt)
        winrate = torch.sigmoid(logits[0] - logits[1]).item()
        return winrate

    def load(self, path):
        self.load_state_dict(torch.load(path))
