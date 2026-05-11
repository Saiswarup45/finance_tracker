from django.urls import path
from .views import transactions, transaction_detail

urlpatterns = [
    path('api/transactions/', transactions),
    path('api/transactions/<int:pk>/', transaction_detail),
]