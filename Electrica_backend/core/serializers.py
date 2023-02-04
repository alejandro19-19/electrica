from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from core.models import *

# Autenticacion del usuario

class AuthTokenSerializer(serializers.Serializer):
    """serializer for the user authentication objectt"""
    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """validate and authenticate the user"""
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )
        if not user:
            msg = _('Imposible autenticar con esas credenciales')
            raise serializers.ValidationError(msg, code='authentication')
        attrs['user'] = user
        return attrs

# Crea el usuario dependiendo de la informacion dada(validated_data informacion recibida del formulario)

class UserSerializer(serializers.ModelSerializer):
    tipo = serializers.CharField(write_only=True)
    salario = serializers.IntegerField(write_only=True, required=False)
    servicio_activo = serializers.BooleanField(write_only=True, required=False)
    al_dia = serializers.BooleanField(write_only=True, required=False)

    def create(self, validated_data):
        tipo = validated_data.pop('tipo')
        al_dia = validated_data.pop('al_dia')
        servicio_activo = validated_data.pop('servicio_activo')
       # user = User.objects.create(**validated_data)
        if tipo == "Admin":
            salario = validated_data.pop('salario')
            user = get_user_model().objects.create_user(**validated_data)
            user.is_admin = True
            # nota como todos inicializan en false en el modelo, se podria quitar
            user.is_client = False
            user.is_operator = False  # revisar si se puede o no
            user.is_gerente = False
            user.is_staff = True
            user.save()
            user_admin = Administrador.objects.create(
                user=user, salario=salario)
        elif tipo == "Cliente":
            user = get_user_model().objects.create_user(**validated_data)
            user.is_admin = False
            user.is_client = True
            user.is_operator = False
            user.is_gerente = False
            user.is_staff = False
            user.save()
            user_cliente = Cliente.objects.create(user=user,
                                                  al_dia=al_dia, servicio_activo=servicio_activo)
        elif tipo == "Operador":
            salario = validated_data.pop('salario')
            user = get_user_model().objects.create_user(**validated_data)
            user.is_admin = False
            user.is_client = False
            user.is_operator = True
            user.is_gerente = False
            user.is_staff = False
            user.save()
            user_operador = Operator.objects.create(user=user, salario=salario)
        elif tipo == "Gerente":
            salario = validated_data.pop('salario')
            user = get_user_model().objects.create_user(**validated_data)
            user.is_admin = False
            user.is_client = False
            user.is_operator = False
            user.is_gerente = True
            user.is_staff = False
            user.save()
            user_gerente = Gerente.objects.create(user=user, salario=salario)
        return user

    class Meta:
        model = get_user_model()
        fields = ("id", "tipo", "password", "nombre","apellido",
                  "cedula", "email", "direccion", "fecha_nacimiento", "celular", "salario", "al_dia", "servicio_activo")

class UserTestClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'nombre','apellido', 'cedula', 'email',
                  'fecha_nacimiento', 'celular', 'direccion')

class UserAdminSerializer(serializers.ModelSerializer): #staff serializer seria mejor
    user = UserTestClientSerializer(many=False, read_only=True)

    class Meta:
        model = Administrador
        fields = ('user', 'salario')

class UserAdminClientSerializer(serializers.ModelSerializer):
    user = UserTestClientSerializer(many=False, read_only=True)

    class Meta:
        model = Cliente
        fields = ("user", "servicio_activo", "al_dia")

class ReportSerializer(serializers.ModelSerializer): #cambiar esto
    cliente_id = serializers.PrimaryKeyRelatedField(read_only = False, many=False, queryset=Cliente.objects.all())
    nombre = serializers.CharField()
    cedula = serializers.IntegerField()
    fecha_nacimiento = serializers.DateField()
    celular = serializers.IntegerField()
    direccion = serializers.CharField()
    salario = serializers.IntegerField()
    password_login = serializers.CharField()

    def create(self, validated_data):
        cliente_id = validated_data.get('cliente_id')
        nombre = validated_data.get('nombre')
        cedula = validated_data.get('cedula')
        fecha_nacimiento = validated_data.get('fecha_nacimiento')
        celular = validated_data.get('celular')
        direccion = validated_data.get('direccion')
        salario = validated_data.get('salario')
        password_login = validated_data.get('password_login')

        reporte = Reporte.objects.create(cliente_id=cliente_id,nombre=nombre,cedula=cedula,fecha_nacimiento=fecha_nacimiento,
            celular=celular,direccion=direccion,salario=salario,password_login=password_login)
        reporte.save()
        return reporte
    
    class Meta:
        model = Reporte
        fields = ('id', 'cliente_id', 'nombre', 'cedula', 'fecha_nacimiento', 'celular', 'direccion', 'salario', 'password_login')

#crea la factura
class RecordBillSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        factura = Factura.objects.create(**validated_data)
        return factura
    class Meta:
        model = Factura
        fields = ('factura_id', 'cliente_id','operador_id','fecha_expedicion',
                  'inicio_plazo','fin_plazo','pagado',
                  'estrato_economico','consumo_en_kwh', 'total_pagar')

class verificarFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = ('factura_id', 'cliente_id','operador_id','fecha_expedicion',
                  'inicio_plazo','fin_plazo','pagado',
                  'estrato_economico','consumo_en_kwh', 'total_pagar')

class UserStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'nombre','apellido','is_admin', 'is_client', 'is_operator', 'is_gerente', 'is_active')

class PublicidadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Publicidad
        fields = ('publicidad_id', 'nombre_empresa', 'imagen')

class ExpiredBillsSerializer(serializers.ModelSerializer):

    class Meta:
        model=Factura
        fields = ('factura_id',)