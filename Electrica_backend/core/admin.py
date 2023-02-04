from django.contrib import admin
from core import models

# Register your models here.
admin.site.register(models.User)
admin.site.register(models.Administrador)
admin.site.register(models.Cliente)
admin.site.register(models.Operator)
admin.site.register(models.Gerente)
admin.site.register(models.Reporte)
admin.site.register(models.Factura)
