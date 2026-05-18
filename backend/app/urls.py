from django.urls import path
from .views import transactions, transaction_detail, budgets, budget_detail, goals, goal_detail

urlpatterns = [
    path('api/transactions/', transactions),
    path('api/transactions/<int:pk>/', transaction_detail),
    path('api/budgets/', budgets),
    path('api/budgets/<int:pk>/', budget_detail),
    path('api/goals/', goals),
    path('api/goals/<int:pk>/', goal_detail),
]