# README

Este repositorio contiene un framework de automatización end-to-end construido con **Playwright** para validar el flujo de búsqueda y filtrado en [Liverpool](https://www.liverpool.com.mx).

## Instalación

```bash
git clone <tu-repo-url>
cd <tu-repo>
npm install
npx playwright install

// Instalación de dependencias
npm install

// Navegadores
npx playwright install
```

## Ejecución
```bash
// Headless
npx playwright test

// Headed
npx playwright test --headed

// Mostrar reporte HTML
npx playwright show-report

```

### Estado de CI/CD
Este proyecto incluye un workflow de GitHub Actions en .github/workflows/test.yml que:

* Instala dependencias
* Ejecuta las pruebas 
* Genera y sube el reporte HTML como artefacto

Puedes verificar la última ejecución exitosa en el repositorio mediante el badge verde:

![CI Status](https://github.com/analaudiiazdlc/liverpool/actions/workflows/playwright.yml/badge.svg)
