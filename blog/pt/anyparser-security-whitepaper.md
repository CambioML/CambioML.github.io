---
title: 'AnyParser On-prem Enterprise Security Whitepaper'
date: '2024-02-03'
keywords: 'AnyParser,local,segurança empresarial,privacidade de dados,análise de documentos,segurança da infraestrutura,criptografia,controle de acesso,conformidade,whitepaper'
image: '/images/solutions/anyparser-performance-graph.png'
---

## Resumo Executivo

AnyParser On-prem é uma solução de análise de documentos de ponta projetada para atender aos rigorosos requisitos de segurança das empresas modernas. Este whitepaper descreve as robustas medidas de segurança implementadas no AnyParser On-prem, garantindo privacidade de dados, conformidade regulatória e eficiência operacional.

## 1. Introdução

No cenário empresarial orientado por dados de hoje, a análise eficiente de documentos é crucial para otimizar operações e processos de tomada de decisão. No entanto, o uso de modelos de linguagem baseados em nuvem para analisar documentos sensíveis introduz riscos significativos à privacidade dos dados. O AnyParser On-prem aborda esses desafios ao fornecer uma solução segura, local, que aproveita o poder de modelos de linguagem avançados enquanto mantém controle total sobre dados sensíveis.

### Por que o AnyParser da CambioML se Destaca: Velocidade e Precisão

O modelo CambioML se destaca tanto em velocidade quanto em precisão, alcançando o equilíbrio ideal para muitas necessidades empresariais. É mais rápido do que a maioria dos grandes modelos proprietários, enquanto oferece maior precisão em comparação com sistemas tradicionais de Reconhecimento Óptico de Caracteres (OCR). Isso significa que sua empresa pode obter o melhor dos dois mundos—análise de documentos rápida e confiável sem sacrificar o desempenho.

![Gráfico de Desempenho do AnyParser](/images/solutions/anyparser-performance-graph.png)

O gráfico acima compara a taxa de transferência e a precisão de diferentes modelos de análise de documentos.

- Eixo X (Horizontal): Representa a "Taxa Média de Transferência (tokens/s)". Isso mede quão rapidamente cada modelo pode processar texto, com valores mais altos indicando velocidades de processamento mais rápidas.

- Eixo Y (Vertical): Representa "Precisão". Isso mede quão corretamente cada modelo interpreta e extrai informações de documentos, com valores mais altos indicando melhor desempenho.

O AnyParser supera outros modelos tanto em precisão (cerca de 0,82) quanto em taxa de transferência (cerca de 160 tokens/s), oferecendo um equilíbrio ideal para as necessidades de análise de documentos empresariais.

## 2. Visão Geral da Arquitetura de Segurança

O AnyParser On-prem é projetado com uma abordagem de segurança em primeiro lugar, oferecendo uma pilha completa desde o modelo em si até a infraestrutura de serviço. Esta solução abrangente pode ser provisionada de forma integrada em ambientes de nuvem privada, como AWS, GCP e Azure.

### 2.1 Modelo de Implantação

O modelo de implantação local garante que todo o processamento de dados ocorra dentro do ambiente privado da organização. Essa abordagem elimina a necessidade de transmitir documentos sensíveis para fora do controle da empresa, abordando preocupações relacionadas à soberania dos dados e conformidade regulatória.

### 2.2 Segurança da Infraestrutura

O AnyParser On-prem utiliza ferramentas e melhores práticas padrão da indústria para uma implantação de infraestrutura segura:

- O Terraform é usado para configurar e gerenciar a infraestrutura em nuvem, garantindo consistência e reduzindo o risco de erros de configuração.

- Contêineres Docker são empregados para isolar a aplicação e suas dependências, aumentando a segurança e a portabilidade.

- A implantação em EC2 ou EKS é gerenciada através do Terraform, mantendo os princípios de infraestrutura como código e permitindo o controle de versão do processo de implantação.

### 2.3 Segurança da Rede

Para garantir acesso e comunicação seguros:

- O Kong ou Nginx é configurado como o controlador de entrada, fornecendo robustas funcionalidades de gerenciamento de tráfego e segurança.

- A configuração de DNS é implementada para acesso interno sem interrupções, reduzindo a exposição a ameaças externas.

![Design do Cambio On-prem](/images/solutions/cambio-onprem-design.png)

## 3. Privacidade e Proteção de Dados

O AnyParser On-prem aborda a necessidade crítica de privacidade de dados na análise de documentos:

- Todos os dados permanecem dentro do ambiente privado da organização, eliminando os riscos associados a modelos proprietários baseados em nuvem.

- A solução está em conformidade com os requisitos regulatórios e políticas internas de proteção de dados, garantindo que documentos sensíveis não sejam enviados para fora do ambiente privado.

## 4. Controle de Acesso e Autenticação

O AnyParser On-prem implementa mecanismos robustos de controle de acesso e autenticação, incluindo:

- Controle de acesso baseado em funções (RBAC) para garantir que apenas pessoal autorizado possa acessar o sistema e os dados analisados.

- Autenticação multifator (MFA) para verificação aprimorada do usuário.

- Auditorias de acesso regulares e registro para monitorar e revisar o uso do sistema.

## 5. Criptografia

Para proteger ainda mais os dados sensíveis, o AnyParser On-prem oferece ao cliente a opção de implementar:

- Criptografia de dados em repouso usando algoritmos de criptografia padrão da indústria.

- Criptografia em trânsito usando protocolos TLS/SSL para todas as comunicações de rede.

- Práticas seguras de gerenciamento de chaves para proteger as chaves de criptografia.

## 6. Monitoramento Contínuo e Resposta a Incidentes

Para manter uma postura de segurança robusta, o AnyParser On-prem oferece ao cliente a opção de implementar:

- Monitoramento em tempo real da infraestrutura e da aplicação para possíveis ameaças de segurança.

- Avaliações regulares de vulnerabilidades e testes de penetração.

- Um plano de resposta a incidentes bem definido para abordar e mitigar incidentes de segurança prontamente.

## 7. Melhorias Futuras em Segurança

A CambioML está comprometida com a inovação contínua em segurança. A próxima opção de implantação baseada em Kubernetes bare-metal proporcionará às empresas ainda mais controle e flexibilidade em suas escolhas de infraestrutura. Essa melhoria permitirá que as organizações implantem o AnyParser On-prem em seu próprio hardware, fortalecendo ainda mais o controle de dados, reduzindo a latência e otimizando os ambientes operacionais.

## 8. Desempenho e Escalabilidade

Enquanto mantém rigorosas medidas de segurança, o AnyParser On-prem não compromete o desempenho:

- A solução oferece um equilíbrio ideal de velocidade e precisão, superando outros modelos em ambas as métricas.

- Com uma precisão de cerca de 0,82 e uma taxa de transferência de cerca de 160 tokens/s, o AnyParser On-prem atende eficientemente às necessidades de análise de documentos empresariais.

## Conclusão

O AnyParser On-prem fornece uma solução de análise de documentos segura, de alto desempenho e precisa que aborda as preocupações críticas de segurança e privacidade das empresas modernas. Ao oferecer um modelo de implantação local, segurança robusta da infraestrutura e um compromisso com a melhoria contínua, o AnyParser On-prem permite que as organizações aproveitem o poder da análise avançada de documentos enquanto mantêm controle total sobre seus dados sensíveis.

## Chamada à Ação

Para organizações que buscam transformar seus fluxos de trabalho de documentos sem comprometer a segurança, o AnyParser On-prem oferece uma solução poderosa e segura. Entre em contato com a CambioML hoje para [agendar uma demonstração](https://www.cambioml.com/book-demo) ou [iniciar um teste](https://www.cambioml.com/sandbox) e experimente os benefícios da análise de documentos segura e eficiente.
