# Generated by Django 4.1.3 on 2023-01-12 16:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_user_cedula'),
    ]

    operations = [
        migrations.RenameField(
            model_name='publicidad',
            old_name='nombre',
            new_name='nombre_empresa',
        ),
    ]
