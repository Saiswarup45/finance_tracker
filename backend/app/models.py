from django.db import models

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)
    note = models.TextField(blank=True)
    recurring = models.CharField(max_length=50, default="none", blank=True)
    tags = models.CharField(max_length=500, default="", blank=True)

    def __str__(self):
        return f"{self.title} - {self.amount}"

class Budget(models.Model):
    category = models.CharField(max_length=100)
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.IntegerField(default=1)
    year = models.IntegerField(default=2026)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - ${self.limit}"

class Goal(models.Model):
    name = models.CharField(max_length=200)
    target = models.DecimalField(max_digits=10, decimal_places=2)
    saved = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ${self.saved}/${self.target}"