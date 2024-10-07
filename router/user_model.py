import numpy as np
import matplotlib.pyplot as plt

PROFIT_PER_POWER_USER = 1.5
PROFIT_PER_CASUAL_USER = 2.25

REVENUE_PER_POWER_USER = 20
REVENUE_PER_CASUAL_USER = 15

TOTAL_MARKET_USERS = 200_000_000
MONTHS = 17

user_ratios = [
    (0, 0),  # Month 0
    (0, 0),  # Month 1
    (0, 0),  # Month 2
    (0, 0),  # Month 3
    (0, 0),  # Month 4
    (0.80, 0.20),  # Month 5
    (0.75, 0.25),  # Month 6
    (0.60, 0.40),  # Month 7
    (0.50, 0.50),  # Month 8
    (0.40, 0.60),  # Month 9
    (0.30, 0.70),  # Month 10
] + [(0.30, 0.70)] * (MONTHS - 11)

fraction_of_market_users = [0.00001 * (1.5 ** i) for i in range(MONTHS)]
total_market_users = [200_000_000 + (i * 20_000_000) for i in range(MONTHS)]
marketing_costs = [0, 1000, 1000, 1000] + [20_000] * (MONTHS - 4)
hosting_costs = [10000] * MONTHS
development_costs = [25000, 25000, 25000, 25000] + [3000] * (MONTHS - 4)
monthly_active_users = [int(total_market_users[i] * fraction_of_market_users[i] * np.exp(0.01 * (i + 1))) for i in range(MONTHS)]

def calculate_profit(monthly_active_users, user_ratios, profit_per_power_user, profit_per_casual_user):
    profits = []
    for month, (power_ratio, casual_ratio) in enumerate(user_ratios):
        power_users = monthly_active_users[month] * power_ratio
        casual_users = monthly_active_users[month] * casual_ratio
        profit = (power_users * profit_per_power_user) + (casual_users * profit_per_casual_user)
        profits.append(profit)
    return profits


def calculate_revenue(monthly_active_users, user_ratios, revenue_per_power_user, revenue_per_casual_user):
    revenues = []
    for month, (power_ratio, casual_ratio) in enumerate(user_ratios):
        power_users = monthly_active_users[month] * power_ratio
        casual_users = monthly_active_users[month] * casual_ratio
        revenue = (power_users * revenue_per_power_user) + (casual_users * revenue_per_casual_user)
        revenues.append(revenue)
    return revenues

# Calculate revenue
revenues = calculate_revenue(monthly_active_users, user_ratios, REVENUE_PER_POWER_USER, REVENUE_PER_CASUAL_USER)
profits = calculate_profit(monthly_active_users, user_ratios, PROFIT_PER_POWER_USER, PROFIT_PER_CASUAL_USER)

# Create a figure with 1 row and 4 columns for the subplots
plt.figure(figsize=(18, 6))  # Adjusted height for better spacing

# Plotting the profit per month as a histogram
""" plt.subplot(1, 4, (2, 4))  # 1 row, 4 columns, first subplot
plt.bar(range(len(profits)), profits, color='skyblue')
plt.title('Profit per Month')
plt.xlabel('Month')
plt.ylabel('Profit ($) in millions', labelpad=15)  # Added labelpad for y-axis
plt.xticks(range(len(profits)), [f'{i}' for i in range(len(profits))])
plt.grid(axis='y')

# Add context for profit values for every month
for i, profit in enumerate(profits):
    if profit >= 1_000_000:
        plt.text(i, profit, f'${profit/1_000_000:.1f}M', ha='center', va='bottom')
    elif profit >= 1_000:
        plt.text(i, profit, f'${profit/1_000:.1f}K', ha='center', va='bottom') """

# Plotting the revenue per month as a histogram
""" plt.subplot(1, 4, (2, 4))  # 1 row, 4 columns, second subplot
bars = plt.bar(range(len(revenues)), revenues, color='lightblue')
plt.title('Revenue per Month')
plt.xlabel('Month')
plt.ylabel('Revenue ($) in millions', labelpad=15)  # Added labelpad for y-axis
plt.xticks(range(len(revenues)), [f'{i}' for i in range(len(revenues))])
plt.grid(axis='y')

# Label every bar with the revenue
for i, bar in enumerate(bars):
    revenue = revenues[i]
    if revenue >= 1_000_000:
        plt.text(bar.get_x() + bar.get_width() / 2, bar.get_height(), f'${revenue/1_000_000:.1f}M', ha='center', va='bottom')
    elif revenue >= 1_000:
        plt.text(bar.get_x() + bar.get_width() / 2, bar.get_height(), f'${revenue/1_000:.1f}K', ha='center', va='bottom') """

# Plotting the number of monthly users (stacked bar chart)
plt.subplot(1, 4, (2, 4))  # 1 row, 4 columns, third subplot
power_users = [monthly_active_users[i] * user_ratios[i][0] for i in range(16)]
casual_users = [monthly_active_users[i] * user_ratios[i][1] for i in range(16)]
plt.bar(range(len(power_users)), power_users, color='orange', label='Power Users')
plt.bar(range(len(casual_users)), casual_users, color='lightblue', label='Casual Users', bottom=power_users)
plt.title('Monthly Users')
plt.xlabel('Month')
plt.ylabel('Number of Users')
plt.xticks(range(len(power_users)), [f'{i}' for i in range(len(power_users))])
plt.yticks([0, 100_000, 200_000, 300_000, 400_000, 500_000, 600_000, 700_000, 800_000, 900_000, 1_000_000], 
           ['0', '100K', '200K', '300K', '400K', '500K', '600K', '700K', '800K', '900K', '1M'])
plt.legend()


# Calculate cumulative net profit
""" total_costs = np.array(marketing_costs) + np.array(hosting_costs) + np.array(development_costs)
net_profit = np.array(profits) - total_costs

cumulative_net_profit = np.cumsum(net_profit)  # Calculate cumulative sum of net profit
plt.subplot(1, 4, (2, 4))  # 1 row, 4 columns, fourth subplot
plt.plot(range(len(cumulative_net_profit)), cumulative_net_profit, marker='o', color='green', label='Cumulative Net Profit')
plt.title('Cumulative Net Profit per Month')
plt.xlabel('Month')
plt.ylabel('Cumulative Net Profit ($) in millions', labelpad=15)  # Added labelpad for y-axis
plt.xticks(range(len(cumulative_net_profit)), [f'{i}' for i in range(len(cumulative_net_profit))])
plt.grid()
plt.legend()

# Add dollar amounts to each point
for i, profit in enumerate(cumulative_net_profit):
    if profit >= 1_000_000:
        plt.text(i, profit + 250_000, f'${profit/1_000_000:.1f}M', ha='center', va='bottom')  # Adjusted y position
    elif profit >= 1_000:
        plt.text(i, profit + 250_000, f'${profit/1_000:.1f}K', ha='center', va='bottom')  # Adjusted y position
    elif profit < 0:
        plt.text(i, profit + 250_000, f'-${abs(profit)/1_000:.1f}K', ha='center', va='bottom')  # Adjusted y position
 """
plt.tight_layout()
plt.show()  # Show all plots in the same window
