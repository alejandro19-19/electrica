from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token

# Modificacion del usuario default de django adecuado a la aplicacion


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('El usuario debe contener email')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """Creates and saves a new superuser"""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

# Modelo de usuario base (atributos generales compartidos)


class User(AbstractBaseUser, PermissionsMixin):
    nombre = models.CharField(max_length=100, null=True)
    apellido = models.CharField(max_length=100, null=True)
    cedula = models.CharField(max_length=500, null=True)
    email = models.EmailField(max_length=80, unique=True)
    fecha_nacimiento = models.DateField(null=True)
    celular = models.CharField(max_length=500, null=True)
    direccion = models.CharField(max_length=500, null=True)
    # user choices
    is_admin = models.BooleanField('admin status', default=False)
    is_client = models.BooleanField('client status', default=False)
    is_operator = models.BooleanField('operator status', default=False)
    is_gerente = models.BooleanField('gerente status', default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserManager()
    USERNAME_FIELD = 'email'

# creacion del token que permitira al usuario acceder a su url respectiva


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

# Modelo de administrador


class Administrador(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="admin")
    salario = models.IntegerField()

# Modelo de cliente


class Cliente(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="client")
    al_dia = models.BooleanField()              # cambio aqui
    servicio_activo = models.BooleanField()     # cambio aqui

# Modelo de operador


class Operator(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="operator")
    salario = models.IntegerField()

# Modelo de gerente


class Gerente(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="gerente")
    salario = models.IntegerField()

# Modelo de reporte


class Reporte(models.Model):
    cliente_id = models.ForeignKey(
        Cliente, on_delete=models.CASCADE, related_name="client_id_rep")
    nombre = models.CharField(max_length=100)
    cedula = models.IntegerField()
    fecha_nacimiento = models.DateField()
    celular = models.IntegerField()
    direccion = models.CharField(max_length=500)
    salario = models.IntegerField()
    password_login = models.CharField(max_length=100)

# Modelo de factura


class Factura(models.Model):
    factura_id = models.AutoField(primary_key=True)
    cliente_id = models.ForeignKey(
        Cliente, on_delete=models.CASCADE, related_name="client_id_fac")
    operador_id = models.ForeignKey(
        Operator, on_delete=models.CASCADE, related_name="operator_id_fac")
    fecha_expedicion = models.DateField()
    inicio_plazo = models.DateField()
    fin_plazo = models.DateField()
    pagado = models.BooleanField()
    fecha_pago_efectuado = models.DateField(auto_now=True)
    estrato_economico = models.IntegerField()
    consumo_en_kwh = models.IntegerField()
    total_pagar = models.IntegerField()


class Publicidad(models.Model):
    publicidad_id = models.AutoField(primary_key=True)
    nombre_empresa = models.CharField(max_length=500)
    imagen = models.ImageField(default="", blank = False, upload_to = 'publicidad')
