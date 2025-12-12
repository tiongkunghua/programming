def sum_to_n(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

result_50_100 = sum_to_n(100) - sum_to_n(49)
print("50 到 100 的總和 =", result_50_100)
