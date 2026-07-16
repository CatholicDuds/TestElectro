# MakerJá Campo Largo

Landing page estática para validar interesse em um delivery local de componentes eletrônicos, robótica e STEM.

## Como testar localmente

Abra o arquivo `index.html` no navegador.

## Como publicar grátis

### Netlify
1. Crie uma conta em netlify.com.
2. Arraste a pasta `makerja-site` para a área de deploy manual.
3. O site ficará no ar em um endereço temporário.

### GitHub Pages
1. Crie um repositório.
2. Envie os arquivos da pasta.
3. Ative Pages nas configurações do repositório.

## Importante sobre o formulário

Nesta versão, os dados ficam salvos apenas no navegador da pessoa que preencheu. Para receber respostas reais, conecte o formulário a um serviço como:

- Formspree
- Tally
- Google Forms
- Airtable Forms
- Supabase

Também é recomendável instalar Google Analytics, Microsoft Clarity ou Plausible para acompanhar visitantes, origem do tráfego e conversões.


## Ativar o Google Analytics

1. Crie uma propriedade GA4 no Google Analytics.
2. Abra **Administrador > Fluxos de dados > Web**.
3. Copie o ID de medicao, no formato `G-XXXXXXXXXX`.
4. No arquivo `index.html`, substitua as duas ocorrencias de `G-SEU_ID_AQUI` pelo seu ID.
5. Publique o site novamente.

O formulario ja envia ao Analytics o evento `generate_lead` quando uma pessoa registra interesse.
