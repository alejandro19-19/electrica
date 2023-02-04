"""electrica_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from core import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [ #1 = bien, #2= mal, #3= tiene permiso, #4= no requiere permisos
    path('admin/', admin.site.urls),
    path('core/user/create',#1 #3
        views.CreateUserAdminView.as_view(), name='create-adm'),
    path('core/user/token',#1 #4
        views.CreateTokenView.as_view(), name='token'),

    #Facturas
    path('core/user/operator/create/bill', #1 #4 deberia tener
        views.CreateBill.as_view(), name ='CreateBills'),
    path('core/factura/view/<int:pk>/', #1 #4 deberia tener
        views.SelectSingleBillView.as_view(), name='verFactura'),
    path('core/factura/view/', #1 #4 deberia tener
        views.SelectAllBillView.as_view(), name='verTodasFacturas'),
    path('core/user/operator/client-expired-bills/<int:cid>/',
        views.get_client_facturas_vencidas, name='expiredBills'),
    path('core/factura/client/view/<int:pk>/',
        views.get_client_factura),
    path('core/operator/generar_factura/<int:pk>/',
        views.crear_factura),  

    #Reportes (se debe borrar)
    path('core/reporte/create', # 1 modelo  no es el definitivo #4 deberia tener
        views.createReportView.as_view(), name='createReporte'),
    path('core/reporte/view/<int:pk>/', # 1 #4 deberia tener
        views.SelectSingleReportView.as_view(), name='verReporte'),
    path('core/reporte/view/', #1 #4 deberia tener
        views.SelectAllReportView.as_view(), name='verTodosReportes'), 

    path('core/user/staff/client/list', # 1 #3 si es admin
        views.admin_list_clients),
    path('core/user/staff/operator/list', # 1 #3 si es admin
        views.admin_list_operators),
    path('core/user/staff/manager/list', # 1 #3 si es admin
        views.admin_list_managers),
    path('core/user/update/me',#2 ejemplo para modificar datos propios vea core/client/me y agrege lo que falta
        views.ManageUserView.as_view(), name='user'),
    path('core/user/me',# 1 #3 
        views.get_status_client),
    path('core/user/client/pay', # 1 #3 cliente
        views.verificarFacturaCliente),
    path('core/user/operator/pay', # 1 #3 operator
        views.verificarFacturaOperador),
    path('core/user/client/update/<int:pk>/', # 1 #3 admin
        views.admin_get_put_client),
    path('core/user/operator/update/<int:pk>/', # 1 #3 admin
        views.admin_get_put_operator),
    path('core/user/manager/update/<int:pk>/', # 1 #3 admin
        views.admin_get_put_manager),  
    path('core/user/client/consumo/<int:pk>/', #1 #4 deberia tener
        views.obtener_consumo_cliente),
    path('core/user/gerente/getrol/<int:pk>/',
        views.manager_get_rol_user), 
    path('core/user/operator/change_client_status/<int:pk>/',
        views.operator_change_client_service_status),
    path('core/user/admin/change_user_status/<int:pk>/',
        views.admin_change_user_status),

    # Publicidad
    path('core/user/operator/publicidad', #permite ingresar el nombre y el logo de una empresa
        views.operator_register_ads),
    path('core/user/gerente/delete/publicidad/<int:pk>/',
        views.manager_delete_ad),  
  
]

urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.PDF_URL, document_root=settings.PDF_ROOT)