import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('./pop.csv')

plt.figure(figsize=(10, 6))

plt.plot(df['Step'], df['Value'], label='Tikslumas', color='#071c2e')

plt.title('Pop žanro modelio tikslumas', fontsize=14)
plt.xlabel('Žingsniai', fontsize=12)
plt.ylabel('Tikslumas', fontsize=12)

plt.ylim(0.6, 0.75)

plt.grid(True)

plt.legend()

plt.tight_layout()

plt.show()
