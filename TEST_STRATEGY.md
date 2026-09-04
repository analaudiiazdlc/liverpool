# Documentación para la estrategia de pruebas
## Objetivo
El propósito de esta estrategia es garantizar que el flujo de búsqueda de productos en el sitio de [Liverpool](https://www.liverpool.com.mx/tienda/home) funcione de manera confiable y consistente. La validación no se limita a comprobar que el buscador muestre resultados, sino que se extiende a verificar que la información desplegada en la interfaz gráfica coincida con la fuente de datos oficial: las respuestas JSON devueltas por la API de búsqueda. De esta forma, se asegura que el usuario final reciba información veraz y actualizada, evitando discrepancias entre lo que se muestra en pantalla y lo que realmente está disponible en el sistema.

## Preferencias en la automatización

Los flujos que se conviene implementar de manera automatizada deben de ser aquellos que tengan varias entradas y/o varias posibles salidas, eso ayuda a que el proceso de verificación por medio de la automatización sea más conveniente. Así mismo conviene de igual forma automatizar aquellos procesos que tengan como fin el finalizar algún proceso largo ya estandarizado dentro del proyecto, vease la compra de uno o varios productos. Son flujos que día a día se ocupan y la gran mayoría si están estandarizados los procesos, se podrán automatizar.
Aquellos flujos que no sería tan óptimo el automatizar serán aquellos casos frontera o los cuales son escenarios a los cuales se llega a un resultado muy específico con pasos también específicos, así como validaciones estéticas de la interfaz.

Si la página incorporara un CAPTCHA en el algún flujo, la estrategia de prueba cambiaría. Los CAPTCHAs están diseñados para impedir automatización, por lo que no se deben resolver directamente en los tests. La forma correcta de manejarlo sería:
* **Ambiente de pruebas:** Solicitar al equipo de desarrollo un entorno de staging donde el CAPTCHA esté deshabilitado o simulado.
* **Mocking de API:** Interceptar la llamada de red que valida el CAPTCHA y devolver una respuesta simulada de éxito.

## Riesgos y sus mitigaciones

Algunos riesgos en este tipo de pruebas son:

* **Elementos dinámicos:**  el campo de búsqueda puede estar oculto o renderizarse con retraso. En modo headed parece funcionar porque el usuario ve la interfaz, pero en headless Playwright exige que el elemento esté realmente visible.
Mitigación: se implementaron esperas explícitas (waitForSelector, waitFor({ state: 'visible' })) y acciones previas como hacer click en el ícono de la lupa para garantizar que el input esté disponible antes de llenarlo.
* **Cambios en la API:** la URL de búsqueda puede variar por actualizaciones internas.
Mitigación: se usan patrones estables en la interceptación (response.url().includes("search")) en lugar de rutas exactas, y se documenta cómo identificar la llamada correcta en DevTools para ajustar rápidamente los tests si cambia el endpoint.
* **Datos variables:** los precios y el stock cambian constantemente, lo que puede romper validaciones rígidas.
Mitigación: se validan atributos estables como nombre del producto y existencia de precio, en lugar de valores exactos que fluctúan. Para precios se puede comprobar que el campo no esté vacío y que tenga formato válido.
* **Dependencia de red:** la latencia puede provocar que los resultados tarden en aparecer.
Mitigación: se configuraron timeouts adecuados y se usa interceptación de red para validar datos directamente desde la API, reduciendo dependencia exclusiva de la UI.
* **Selectores frágiles:** cambios en el diseño pueden romper los locators.
Mitigación: se priorizan atributos semánticos (aria-label, placeholder) sobre XPath largos, y se centralizan los locators en un archivo para facilitar mantenimiento.

## CI 

Integrar este flujo en un pipeline de CI con más de 50 suites de prueba requiere pensar en escalabilidad y eficiencia. No basta con que el test funcione de manera aislada; debe convivir con decenas de otros flujos sin ralentizar ni comprometer la estabilidad del pipeline. Los cambios clave serían:

* **Optimización de tiempos de ejecución:** se limitarían las pruebas de búsqueda a los casos críticos en el pipeline principal. Los escenarios más extensos se dejarían para ejecuciones programadas (nightly builds), evitando que el pipeline diario se vuelva demasiado pesado.

* **Paralelización y sharding:** se configuraría Playwright para ejecutar pruebas en paralelo, dividiendo las suites en shards. Esto permite que los 50+ flujos se distribuyan en múltiples jobs y se completen más rápido.

* **Selección de pruebas críticas:** incluir solo los tests esenciales de búsqueda en el pipeline principal y dejar pruebas más pesadas para ejecuciones nocturnas o programadas.

* **Reportes estandarizados:** se adaptaría el reporter de Playwright para generar resultados en formato JUnit o Allure, integrables con dashboards de CI/CD. Esto facilita que el equipo vea resultados consolidados en un solo lugar, sin tener que revisar reportes aislados.

* **Separación de ambientes:** se recomendaría correr estas pruebas en un entorno de staging con datos más estables, para que los resultados no dependan de cambios constantes en producción.

En resumen, al integrarlo en un pipeline grande, el objetivo es minimizar impacto en tiempos, maximizar estabilidad y asegurar que los resultados sean claros y útiles para todo el equipo. Así, el flujo de búsqueda se convierte en una pieza más dentro de un ecosistema de pruebas robusto y escalable.

