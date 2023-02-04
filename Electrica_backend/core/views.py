from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken, AuthTokenSerializer
from rest_framework.authtoken.models import Token
from rest_framework import status
from core.serializers import UserSerializer, PublicidadSerializer, UserAdminSerializer, ReportSerializer, UserStatusSerializer, verificarFacturaSerializer, RecordBillSerializer, UserAdminClientSerializer, UserTestClientSerializer, ExpiredBillsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.settings import api_settings
from rest_framework.decorators import permission_classes, authentication_classes
from .models import Administrador, Gerente, Operator, User, Cliente, Factura, Reporte, Publicidad
import requests
import json
from datetime import datetime, timedelta
from django.template import loader
from django.shortcuts import render
from django.http import HttpResponse
import random
from weasyprint import HTML, CSS

# Create your views here.
# creacion o autenticacion del token


class CreateTokenView(ObtainAuthToken):
    """Create auth token"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'error': False,
                'token': token.key,
                'email': user.email,
                'name': user.nombre,
            })
        else:
            return Response({"error": True}, status=status.HTTP_200_OK)
    #

# clase que sirve para que un usuario se modifique a si mismo, nota falta limitar los atributos que se pueden modificar


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""  # cambiar el serializer para que permita cambiar
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        """Retrieve authenticated user"""
        return self.request.user

# creacion de usuarios


class CreateUserAdminView(generics.CreateAPIView):
    """Create user on the system"""
    permission_classes = [
        AllowAny]  # el allowAny no es permanente debe cambiarse en un futuro
    serializer_class = UserSerializer

# Me muestra en pantalla una sola factura


class SelectSingleBillView(generics.RetrieveAPIView):
    queryset = Factura.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RecordBillSerializer

# Me muestra la factura de todos los clientes


class SelectAllBillView(generics.ListAPIView):
    queryset = Factura.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RecordBillSerializer

# Me crea un reporte


class createReportView(generics.CreateAPIView):
    queryset = Reporte.objects.all()
    # el allowAny no es permanente debe cambiarse en un futuro
    permission_classes = [AllowAny]
    serializer_class = ReportSerializer

# Me muestra en pantalla un solo reporte.


class SelectSingleReportView(generics.RetrieveAPIView):
    queryset = Reporte.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ReportSerializer

# Me muestra en pantalla todos los reportes de todos los clientes


class SelectAllReportView(generics.ListAPIView):
    queryset = Reporte.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ReportSerializer

# Clase  que permite crear facturas de los clientes


class CreateBill(generics.CreateAPIView):
    # el allowAny no es permanente debe cambiarse en un futuro
    permission_classes = [AllowAny]
    serializer_class = RecordBillSerializer


# Metodo para que un administrador obtenga la informacion de todos los clientes existentes
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_list_clients(request):
    user = Token.objects.get(key=request.auth.key).user
    if user.is_admin == True or user.is_operator == True or user.is_gerente == True:
        user_client = Cliente.objects.all()
        serializer = UserAdminClientSerializer(
            user_client, many=True, context={'request': request})
        return Response(serializer.data)
    else:
        return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)

# Metodo para que un administrador obtenga la informacion de todos los operadores existentes


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_list_operators(request):
    user = Token.objects.get(key=request.auth.key).user
    if user.is_admin == True or user.is_gerente == True:
        user_client = Operator.objects.all()
        serializer = UserAdminSerializer(
            user_client, many=True, context={'request': request})
        return Response(serializer.data)
    else:
        return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)

# Metodo para que un administrador obtenga la informacion de todos los gerentes existentes


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_list_managers(request):
    user = Token.objects.get(key=request.auth.key).user
    if user.is_admin == True:
        user_client = Gerente.objects.all()
        serializer = UserAdminSerializer(
            user_client, many=True, context={'request': request})
        return Response(serializer.data)
    else:
        return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)

# Metodo para que un administrador pueda modificar la informacion de un cliente


@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_get_put_client(request, pk):
    try:
        user = Token.objects.get(key=request.auth.key).user
        if user.is_admin == True or user.is_operator == True or user.is_gerente == True:
            user_client = Cliente.objects.get(user__id=pk)
        else:
            return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)
    except Cliente.DoesNotExist:
        return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = UserAdminClientSerializer(
            user_client, many=False, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        try:
            client_personal_data = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
        serializer_user = UserTestClientSerializer(
            client_personal_data, data=request.data["user"], context={'request': request})
        serializer_client = UserAdminClientSerializer(
            user_client, data=request.data, context={'request': request})
        if serializer_user.is_valid():
            if serializer_client.is_valid():
                serializer_user.save()
                serializer_client.save()
                return Response(serializer_client.data)
        return Response({"error": True}, status=status.HTTP_400_BAD_REQUEST)

# Metodo para que un administrador pueda modificar la informacion de un operador


@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_get_put_operator(request, pk):
    try:
        user = Token.objects.get(key=request.auth.key).user
        if user.is_admin == True or user.is_gerente == True:
            user_operator = Operator.objects.get(user__id=pk)
        else:
            return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)
    except Operator.DoesNotExist:
        return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = UserAdminSerializer(
            user_operator, many=False, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        try:
            operator_personal_data = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
        serializer_user = UserTestClientSerializer(
            operator_personal_data, data=request.data["user"], context={'request': request})
        # print("serializer user", serializer_user)
        serializer_operator = UserAdminSerializer(
            user_operator, data=request.data, context={'request': request})
        # print("serializer operator", serializer_user)
        if serializer_user.is_valid():
            if serializer_operator.is_valid():
                serializer_user.save()
                serializer_operator.save()
                return Response(serializer_operator.data)
        return Response({"error": True}, status=status.HTTP_400_BAD_REQUEST)

# Metodo para que un administrador pueda modificar la informacion de un manager


@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_get_put_manager(request, pk):
    try:
        user = Token.objects.get(key=request.auth.key).user
        if user.is_admin == True:
            user_manager = Gerente.objects.get(user__id=pk)
        else:
            return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)
    except Gerente.DoesNotExist:
        return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = UserAdminSerializer(
            user_manager, many=False, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        try:
            manager_personal_data = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
        serializer_user = UserTestClientSerializer(
            manager_personal_data, data=request.data["user"], context={'request': request})
        # print("serializer user", serializer_user)
        serializer_manager = UserAdminSerializer(
            user_manager, data=request.data, context={'request': request})
        # print("serializer operator", serializer_user)
        if serializer_user.is_valid():
            if serializer_manager.is_valid():
                serializer_user.save()
                serializer_manager.save()
                return Response(serializer_manager.data)
        return Response({"error": True}, status=status.HTTP_400_BAD_REQUEST)

# metodo para que el cliente pueda pagar una factura


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def verificarFacturaCliente(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
        if user.is_client == True:
            user_id = user.id
        else:
            return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)
    except Cliente.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    try:
        factura = Factura.objects.get(pk=request.data['factura_id'])
        if factura.cliente_id.user.id == user_id:
            if factura.pagado == False:
                factura.pagado = True
                factura.save()
                serializerFactura = verificarFacturaSerializer(factura)
                return Response(serializerFactura.data)
            else:
                return Response({"error": "Factura ya pagada."})
        else:
            return Response({"error": "La factura no pertenece a este usuario"})

    except Factura.DoesNotExist:
        return Response({"error": "Esta factura no existe"})

# metodo para que un cliente pueda pagar una factura a traves de un operador


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def verificarFacturaOperador(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
        cliente_id = Cliente.objects.get(pk=request.data['cliente_id'])
        if user.is_operator == False:
            return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)

    except Cliente.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    try:
        factura = Factura.objects.get(pk=request.data['factura_id'])
        if factura.cliente_id.user.id == cliente_id.user.id:
            if factura.pagado == False:
                factura.pagado = True
                factura.save()
                serializerFactura = verificarFacturaSerializer(factura)
                return Response(serializerFactura.data)
            else:
                return Response({"error": "Factura ya pagada."})
        else:
            return Response({"error": "La factura no pertenece a este usuario"})

    except Factura.DoesNotExist:
        return Response({"error": "Esta factura no existe"})

# Metodo para que un cliente obtenga su propia informacion


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_status_client(request):
    user = Token.objects.get(key=request.auth.key).user
    if user.is_client == True:
        user_client = Cliente.objects.get(user_id=user.id)
        user_status1 = User.objects.get(pk=user.id).is_client
        user_status2 = User.objects.get(pk=user.id).is_operator
        user_status3 = User.objects.get(pk=user.id).is_gerente
        user_status4 = User.objects.get(pk=user.id).is_admin
        serializer = UserAdminClientSerializer(
            user_client, many=False, context={'request': request})
        return Response({"Info_user": serializer.data, "is_client": user_status1, "is_operator": user_status2, "is_gerente": user_status3, "is_admin": user_status4})
    if user.is_operator == True:
        user_client = Operator.objects.get(user_id=user.id)
        user_status1 = User.objects.get(pk=user.id).is_client
        user_status2 = User.objects.get(pk=user.id).is_operator
        user_status3 = User.objects.get(pk=user.id).is_gerente
        user_status4 = User.objects.get(pk=user.id).is_admin
        serializer = UserAdminSerializer(
            user_client, many=False, context={'request': request})
        return Response({"Info_user": serializer.data, "is_client": user_status1, "is_operator": user_status2, "is_gerente": user_status3, "is_admin": user_status4})
    if user.is_gerente == True:
        user_client = Gerente.objects.get(user_id=user.id)
        user_status1 = User.objects.get(pk=user.id).is_client
        user_status2 = User.objects.get(pk=user.id).is_operator
        user_status3 = User.objects.get(pk=user.id).is_gerente
        user_status4 = User.objects.get(pk=user.id).is_admin
        serializer = UserAdminSerializer(
            user_client, many=False, context={'request': request})
        return Response({"Info_user": serializer.data, "is_client": user_status1, "is_operator": user_status2, "is_gerente": user_status3, "is_admin": user_status4})
    if user.is_admin == True:
        user_client = Administrador.objects.get(user_id=user.id)
        user_status1 = User.objects.get(pk=user.id).is_client
        user_status2 = User.objects.get(pk=user.id).is_operator
        user_status3 = User.objects.get(pk=user.id).is_gerente
        user_status4 = User.objects.get(pk=user.id).is_admin
        serializer = UserAdminSerializer(
            user_client, many=False, context={'request': request})
        return Response({"Info_user": serializer.data, "is_client": user_status1, "is_operator": user_status2, "is_gerente": user_status3, "is_admin": user_status4})
    else:
        return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)

# Metodo para obtener el consumo mensual de un usuario


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtener_consumo_cliente(request, pk):
    try:
        cliente = Cliente.objects.get(pk=pk)
        cliente_id = cliente.pk
        url = "https://energy-service-ds-v3cot.ondigitalocean.app/consumption"
        payload = json.dumps({
            "client_id": cliente_id
        })
        headers = {
            'Content-Type': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload)
        return Response(response.json())
    except Cliente.DoesNotExist:
        return Response({"error": True})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def manager_get_rol_user(request, pk):
    user = Token.objects.get(key=request.auth.key).user
    if user.is_gerente == True:
        try:
            user_any = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": True, "error_cause": 'user with id ' + str(pk) + ' does not exist'}, status=status.HTTP_404_NOT_FOUND)
        user_status1 = User.objects.get(pk=pk).is_client
        user_status2 = User.objects.get(pk=pk).is_operator
        user_status3 = User.objects.get(pk=pk).is_gerente
        user_status4 = User.objects.get(pk=pk).is_admin
        return Response({"user_id": pk, "is_client": user_status1, "is_operator": user_status2, "is_gerente": user_status3, "is_admin": user_status4})
    else:
        return Response({"error": True, "error_cause": "current user is not an Gerente"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def operator_change_client_service_status(request,pk):
    try:
        user = Token.objects.get(key=request.auth.key).user
        client = Cliente.objects.get(pk = pk)
        if user.is_operator == False:
            return Response({"error": True, "error_cause":"current user is not an Operador"}, status=status.HTTP_401_UNAUTHORIZED)
    except Cliente.DoesNotExist:
        return Response({"error": True,"error_cause":'cliente with id '+ str(pk) +' does not exist'},status=status.HTTP_404_NOT_FOUND)
    if client.al_dia:
        client.al_dia = False
        client.save()
        serializer = UserAdminClientSerializer(client, many=False, context={'request': request})
        return Response({"Client":serializer.data})
    else:
        client.al_dia = True
        client.save()
        serializer = UserAdminClientSerializer(client, many=False, context={'request': request})
        return Response({"Client":serializer.data})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_change_user_status(request, pk):
    try:
        current_user = Token.objects.get(key=request.auth.key).user
        user = User.objects.get(pk=pk)
        if current_user.is_admin == False:
            return Response({"error": True, "error_cause": "current user is not an Admin"}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'user with id ' + str(pk) + ' does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if current_user.id == user.id:
        # Revisar el codigo de error acá
        return Response({"error": True, "error_cause": "The current user is trying to edit himself"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        if user.is_client:
            try:
                user_cliente = Cliente.objects.get(pk=pk)
            except Cliente.DoesNotExist:
                return Response({"error": True, "error_cause": 'client with id ' + str(pk) + ' does not exist'}, status=status.HTTP_404_NOT_FOUND)
            if user.is_active:
                user.is_active = False
                user_cliente.servicio_activo = False
                user.save()
                user_cliente.save()
                serializer = UserStatusSerializer(
                    user, many=False, context={'request': request})
                return Response({"User": serializer.data})
            else:
                user.is_active = True
                user_cliente.servicio_activo = True
                user.save()
                user_cliente.save()
                serializer = UserStatusSerializer(
                    user, many=False, context={'request': request})
                return Response({"User": serializer.data})

        elif user.is_active:
            user.is_active = False
            user.save()
            serializer = UserStatusSerializer(
                user, many=False, context={'request': request})
            return Response({"User": serializer.data})
        else:
            user.is_active = True
            user.save()
            serializer = UserStatusSerializer(
                user, many=False, context={'request': request})
            return Response({"User": serializer.data})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_client_factura(request, pk):
    user = Token.objects.get(key=request.auth.key).user
    if user.is_operator == True:
        try:
            facturas = Factura.objects.filter(cliente_id=pk)
            facturasSinPagar = Factura.objects.filter(
                cliente_id=pk, pagado=False)
            cantidadFacturasSinPagar = len(facturasSinPagar)
            al_dia = True
            if cantidadFacturasSinPagar >= 2:
                al_dia = False
            serializer = RecordBillSerializer(
                facturas, many=True, context={'request': request})
        except Factura.DoesNotExist:
            return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)

        return Response({"Facturas": serializer.data, "Al_dia": al_dia})
    else:
        return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)

# Metodo para crear publicidad


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def operator_register_ads(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.is_operator == True:
        if 'imagen' not in request.data:
            return Response({"error": True, "error_cause": 'Select an image'}, status=status.HTTP_204_NO_CONTENT)
        archivo = str(request.FILES)

        serializer = PublicidadSerializer(data=request.data)

        if serializer.is_valid():
            validated_data = serializer.validated_data
            publicidad = Publicidad(**validated_data)
            publicidad.save()

            serializer_response = PublicidadSerializer(publicidad)

            return Response(serializer_response.data, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": True, "error_cause": "current user is not a Gerente"}, status=status.HTTP_401_UNAUTHORIZED)

# Metodo para borrar una publicidad que ya no se necesite

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def manager_delete_ad(request, pk):
    try:
        current_user = Token.objects.get(key=request.auth.key).user
        publicidad = Publicidad.objects.get(pk=pk)
        if current_user.is_gerente == False:
            return Response({"error": True, "error_cause": "current user is not a Gerente"}, status=status.HTTP_401_UNAUTHORIZED)
    except Publicidad.DoesNotExist:
        return Response({"error": True, "error_cause": 'Publicidad with id ' + str(pk) + ' does not exist'}, status=status.HTTP_404_NOT_FOUND)

    publicidad.imagen.delete(save=True)
    publicidad.delete()

    return Response({"error": False, "details": 'Publicidad with id ' + str(pk) + ' was successfully deleted'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_client_facturas_vencidas(request, cid):
    try:
        current_user = Token.objects.get(key=request.auth.key).user
        now = datetime.now()
        facturas = Factura.objects.filter(
            cliente_id=cid, fin_plazo__lte=now.date(), pagado=False)
        if current_user.is_operator == False:
            return Response({"error": True, "error_cause": "current user is not an Operador"}, status=status.HTTP_401_UNAUTHORIZED)
    except Factura.DoesNotExist:
        return Response({"error": True, "error_cause": "this client has not bills"}, status=status.HTTP_404_NOT_FOUND)
    serializer = ExpiredBillsSerializer(facturas, many=True)
    return Response({'facturas_vencidas': serializer.data}, status=status.HTTP_200_OK)


# Metodo para generar la factura en pdf

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def crear_factura(request, pk):
    try:
        # valores que se le pasan al html
        factura = Factura.objects.get(pk=pk)
        fecha_inicial_factura = factura.inicio_plazo
        fecha_final_factura = factura.fin_plazo
        fecha_expedicion = fecha_final_factura + timedelta(2)
        dias_facturados = (factura.fin_plazo-factura.inicio_plazo).days
        anho_cuenta = fecha_final_factura.year
        meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                 "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
        mes_cuenta = meses[fecha_final_factura.month-1]
        publicidades = Publicidad.objects.all()
        randomizado = random.randint(0, len(publicidades)-1)
        publicidad = publicidades[randomizado]
        url = publicidad.imagen
        url_completa = "http://127.0.0.1:8000/media-files/" + str(url)
        consumo = factura.consumo_en_kwh
        no_medidor = random.randint(10000000, 99999999)
        valor_unitario = 600
        valor_total = consumo * valor_unitario
        contribucion = 27000
        total_pagar = valor_total + contribucion
        pago_realizado = "No factura previa"
        valor_pago = "No factura previa"
        interes_mora = 0
        valor_iva = 0
        pagos_acumulados = 0
        deuda_total = total_pagar
        try:
            # se obtiene la anterior factura pagada por el cliente
            cliente = factura.cliente_id
            facturas_cliente = Factura.objects.filter(
                cliente_id=cliente.pk).order_by('-factura_id')
            ultima_factura_pagada = []
            tamanho = len(facturas_cliente)
            facturas_cliente_pagadas = Factura.objects.filter(
                cliente_id=cliente.pk, pagado=True).order_by('-factura_id')[:1]
            if len(facturas_cliente_pagadas) > 0:
                factura_cliente_pagadas = facturas_cliente_pagadas[0]
                pago_realizado = factura_cliente_pagadas.fecha_pago_efectuado
                valor_pago = factura_cliente_pagadas.total_pagar
                interes_mora = 0  # agregar la mora en el modelo?
            facturas_cliente_sin_pagar = Factura.objects.filter(
                cliente_id=cliente.pk, pagado=False).order_by('-factura_id')
            # Se encuentran las facturas que no han sido pagadas hasta la fecha y se suma su valor
            if len(facturas_cliente_sin_pagar) > 0:
                variable = 1
                for i in range(len(facturas_cliente_sin_pagar)-1):
                    pagos_acumulados += facturas_cliente_sin_pagar[variable].total_pagar
                    variable = variable + 1
            deuda_total += pagos_acumulados + valor_iva
            try:
                user_client = cliente.user
            except User.DoesNotExist:
                return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
        except Cliente.DoesNotExist:
            return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
    except Factura.DoesNotExist:
        return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
    context = {
        "nombre_cliente": user_client.nombre, "apellido_cliente": user_client.apellido, "direccion_cliente": user_client.direccion, "total_pagar": factura.total_pagar,
        "estrato": factura.estrato_economico, "fecha_inicial": fecha_inicial_factura, "fecha_final": fecha_final_factura, "fecha_resta": dias_facturados, "fecha_expedicion": fecha_expedicion,
        "mes_cuenta": mes_cuenta, "anho_cuenta": anho_cuenta, "publicidad": url_completa, "no_medidor": no_medidor, "consumo_actual": consumo, "valor_total": valor_total, "contribucion": contribucion,
        "total_pagar": total_pagar, "valor_unitario": valor_unitario, "pago_realizado": pago_realizado, "valor_pago": valor_pago, "interes_mora": interes_mora, "iva": valor_iva, "cuentas_vencidas": pagos_acumulados,
                                    "deuda_total": deuda_total
    }
    html_string = loader.render_to_string(
        'factura.html', context)
    html = HTML(string=html_string,
                base_url="core/templates")
    nombre_pdf = "factura_"+str(pk)+".pdf"
    nombre_archivo_pdf = user_client.nombre +"_"+user_client.apellido+"_"+nombre_pdf
    pdf = html.write_pdf("facturas_pdf/" + nombre_archivo_pdf)
    
    body = '''Factura pdf
    '''

    sender = 'pruebapruebas205'
    password = 'onupdrtfvpvvhasr'
    receiver = user_client.email

    # Setup the MIME
    message = MIMEMultipart()
    message['From'] = sender
    message['To'] = receiver
    message['Subject'] = 'Factura'+" " + user_client.nombre +" "+user_client.apellido

    message.attach(MIMEText(body, 'plain'))

    pdfname = 'facturas_pdf/' + nombre_archivo_pdf

    # open the file in bynary
    binary_pdf = open(pdfname, 'rb')

    payload = MIMEBase('application', 'octate-stream', Name=pdfname)
    payload.set_payload((binary_pdf).read())

    # enconding the binary into base64
    encoders.encode_base64(payload)

    # add header with pdf name
    payload.add_header('Content-Decomposition', 'attachment', filename=pdfname)
    message.attach(payload)

    # use gmail with port
    session = smtplib.SMTP('smtp.gmail.com', 587)
    # enable security
    session.starttls()

    # login with mail_id and password
    session.login(sender, password)

    text = message.as_string()
    session.sendmail(sender, receiver, text)
    session.quit()
    pdf_name_return = "/pdf/" + nombre_archivo_pdf
    return Response({"PDF": pdf_name_return})

# Metodo para obtener los datos de autenticacion del usuario

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def get_token(request):
    user = User.objects.get(id=request.data['id_user'])
    token = Token.objects.get(user=user)
    return Response({"email": user.email, "token": token.key})
