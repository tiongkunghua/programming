def sum_to_n(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

result = sum_to_n(100)
print("1 到 100 的總和 =", result)
