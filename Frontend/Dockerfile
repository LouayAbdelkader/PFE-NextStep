# Utilisation de l'image de base Nginx
FROM nginx:alpine

# Suppression du fichier de configuration par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers du frontend vers le dossier de Nginx
COPY . /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

# Démarrage du serveur Nginx
CMD ["nginx", "-g", "daemon off;"]
