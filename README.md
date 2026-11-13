# Studio 01 · Production Web

> **Independent Design & Engineering Lab**  
> Sitio web oficial de producción para **Studio 01** (`[ s01 ]`).  
> *Designed with intent. Built with precision.*

---

## 🛠️ Arquitectura Técnica

* **Estructura**: Frontend estático de alto rendimiento, cero dependencias pesadas (`zero-bloat`).
* **HTML5**: Marcado semántico, accesibilidad (`WCAG AA`), metadatos Open Graph, Twitter Cards y datos estructurados Schema.org (`ProfessionalService`).
* **CSS3**: Sistema de diseño brutalista responsivo mobile-first con breakpoints estándar de la industria (Tailwind CSS: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`).
* **JavaScript (ES6+)**: Lógica desacoplada en `js/app.js`:
  * Motor de calendario dinámico en tiempo real (`new Date()`).
  * Micro-UI interactiva para demostración de CRM con Asistencia IA.
  * Selector interactivo de turnos con confirmación en vivo.
  * Calculador de presupuestos sincronizado con generación de enlaces a WhatsApp.
  * Barra de navegación móvil flotante (*Sticky Mobile Bar*).

---

## 📁 Estructura del Proyecto

```
web/
├── index.html        # Página principal y estructura semántica
├── css/
│   └── styles.css    # Sistema de estilos y variables de diseño
├── js/
│   └── app.js        # Lógica cliente y configuración de negocio
├── .gitignore        # Exclusiones de Git
└── README.md         # Documentación del proyecto
```

---

## ⚙️ Configuración Rápida

Para actualizar los datos comerciales (número de WhatsApp o tarifas base), editar el objeto `CONFIG` al inicio de `js/app.js`:

```javascript
const CONFIG = {
  // Código de país + número (sin espacios ni '+')
  whatsappNumber: "5493564000000",

  pricing: {
    tierBase: { maxSections: 3, total: 110000, label: "PLAN BASE: HASTA 3 SECCIONES" },
    tierStandard: { maxSections: 6, total: 150000, label: "PLAN ESTÁNDAR: 4 A 6 SECCIONES" },
    tierComplete: { maxSections: 10, total: 200000, label: "PLAN COMPLETO: 7 A 10 SECCIONES" },
    maintenanceBaseUsd: 20,
    supportMonths: 6
  }
};
```

---

## 🚀 Despliegue en VPS (Hostinger)

El proyecto está preparado para servirse mediante **Caddy** o **Nginx**:

### Opción A: Servidor Web Caddy (Recomendado)
Caddy gestiona certificados SSL automáticamente y soporta HTTP/3:

```caddyfile
s01.studio {
    root * /var/www/s01.studio
    file_server
    encode zstd gzip

    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

### Opción B: Nginx
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name s01.studio www.s01.studio;

    root /var/www/s01.studio;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```
