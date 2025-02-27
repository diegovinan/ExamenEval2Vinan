# Imagen base Debian 12
FROM debian:12

# Instalamos Apache y OpenSSL
RUN apt update && apt install -y apache2 openssl

# Habilitamos módulos necesarios
RUN a2enmod ssl rewrite

# Cambiamos el puerto de Apache a 3000 en la configuración
RUN sed -i 's/Listen 443/Listen 3000/' /etc/apache2/ports.conf

# Habilitamos el sitio con la configuración SSL
RUN ln -s /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-enabled/default-ssl.conf

# Exponemos los puertos HTTP (80) y HTTPS (3000)
EXPOSE 80 3000

# Iniciamos Apache en primer plano
CMD ["apachectl", "-D", "FOREGROUND"]
