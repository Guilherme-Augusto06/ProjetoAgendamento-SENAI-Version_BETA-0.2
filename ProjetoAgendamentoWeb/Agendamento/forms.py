from django import forms
from .models import Sala

class SalaForm(forms.ModelForm):
    class Meta:
        model = Sala
        fields = ['sala', 'descricao', 'equipamentos']

class formCadastroUsuario(forms.Form):
    first_name = forms.CharField(label="Nome", max_length=40)
    last_name = forms.CharField(label="Sobrenome", max_length=40)
    user = forms.CharField(label="Usuário", max_length=40)   
    email = forms.EmailField(label="Email", max_length=100)
    password = forms.CharField(label="Senha", widget=forms.PasswordInput)

class FormLogin(forms.Form):
    user = forms.CharField(label="Usuario", max_length=40)
    password = forms.CharField(label="Senha", widget=forms.PasswordInput)
    
class AdicionarSalaForm(forms.ModelForm):
    class Meta:
        model = Sala
        fields = ['sala', 'descricao', 'equipamentos']
