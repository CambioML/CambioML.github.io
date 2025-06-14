---
title: 'AnyParser 本地企业安全白皮书'
date: '2024-02-03'
keywords: 'AnyParser,本地,企业安全,数据隐私,文档解析,基础设施安全,加密,访问控制,合规,白皮书'
image: '/images/solutions/anyparser-performance-graph.png'
---

## 执行摘要

AnyParser 本地是一款尖端的文档解析解决方案，旨在满足现代企业严格的安全要求。本文档概述了 AnyParser 本地实施的强大安全措施，确保数据隐私、合规性和运营效率。

## 1. 引言

在当今以数据驱动的商业环境中，高效的文档解析对于简化运营和决策过程至关重要。然而，使用基于云的语言模型解析敏感文档会带来显著的数据隐私风险。AnyParser 本地通过提供一个安全的本地解决方案来应对这些挑战，利用先进语言模型的强大功能，同时保持对敏感数据的完全控制。

### 为什么 CambioML AnyParser 脱颖而出：速度与准确性

CambioML 模型在速度和准确性方面表现卓越，为许多商业需求提供了理想的平衡。它比大多数大型专有模型更快，同时提供比传统光学字符识别（OCR）系统更高的准确性。这意味着您的企业可以在快速、可靠的文档解析与性能之间实现最佳平衡。

![AnyParser 性能图](/images/solutions/anyparser-performance-graph.png)

上面的图表比较了不同文档解析模型的吞吐量和准确性。

- X 轴（水平）：表示“平均吞吐量（tokens/s）”。这衡量每个模型处理文本的速度，数值越高表示处理速度越快。

- Y 轴（垂直）：表示“准确性”。这衡量每个模型从文档中解释和提取信息的正确性，数值越高表示性能越好。

AnyParser 在准确性（约 0.82）和吞吐量（约 160 tokens/s）方面均优于其他模型，为企业文档解析需求提供了最佳平衡。

## 2. 安全架构概述

AnyParser 本地采用安全优先的设计理念，提供从模型本身到服务基础设施的完整堆栈。该综合解决方案可以无缝部署到 AWS、GCP 和 Azure 等私有云环境中。

### 2.1 部署模型

本地部署模型确保所有数据处理都在组织的私有环境中进行。这种方法消除了将敏感文档传输到公司控制之外的需要，解决了与数据主权和合规性相关的担忧。

### 2.2 基础设施安全

AnyParser 本地利用行业标准工具和最佳实践进行安全基础设施部署：

- 使用 Terraform 设置和管理云基础设施，确保一致性并降低配置错误的风险。

- 使用 Docker 容器隔离应用程序及其依赖项，增强安全性和可移植性。

- 通过 Terraform 管理对 EC2 或 EKS 的部署，维护基础设施即代码原则，并启用部署过程的版本控制。

### 2.3 网络安全

为确保安全访问和通信：

- 设置 Kong 或 Nginx 作为入口控制器，提供强大的流量管理和安全功能。

- 实施 DNS 配置以实现无缝的内部访问，减少外部威胁的暴露。

![Cambio 本地设计](/images/solutions/cambio-onprem-design.png)

## 3. 数据隐私与保护

AnyParser 本地解决了文档解析中对数据隐私的关键需求：

- 所有数据保留在组织的私有环境中，消除了与基于云的专有模型相关的风险。

- 该解决方案通过确保敏感文档不发送到私有环境之外，符合监管要求和内部数据保护政策。

## 4. 访问控制与身份验证

AnyParser 本地实施了强大的访问控制和身份验证机制，包括：

- 基于角色的访问控制（RBAC），确保只有授权人员可以访问系统和解析数据。

- 多因素身份验证（MFA），增强用户验证。

- 定期访问审计和日志记录，以监控和审查系统使用情况。

## 5. 加密

为了进一步保护敏感数据，AnyParser 本地为客户提供实施以下选项：

- 使用行业标准加密算法进行静态数据加密。

- 在所有网络通信中使用 TLS/SSL 协议进行传输加密。

- 采用安全的密钥管理实践以保护加密密钥。

## 6. 持续监控与事件响应

为了保持强大的安全态势，AnyParser 本地为客户提供实施以下选项：

- 对基础设施和应用程序进行实时监控，以识别潜在的安全威胁。

- 定期进行漏洞评估和渗透测试。

- 制定明确的事件响应计划，以及时处理和缓解安全事件。

## 7. 未来安全增强

CambioML 致力于在安全领域的持续创新。即将推出的基于裸金属 Kubernetes 的部署选项将为企业提供更大的控制权和灵活性。这一增强将允许组织在自己的硬件上部署 AnyParser 本地，进一步加强数据控制，减少延迟，并优化运营环境。

## 8. 性能与可扩展性

在保持严格安全措施的同时，AnyParser 本地并不妥协于性能：

- 该解决方案提供了速度与准确性的最佳平衡，在两个指标上均优于其他模型。

- 凭借约 0.82 的准确性和约 160 tokens/s 的吞吐量，AnyParser 本地高效满足企业文档解析需求。

## 结论

AnyParser 本地提供了一种安全、高性能和准确的文档解析解决方案，解决了现代企业的关键安全和隐私问题。通过提供本地部署模型、强大的基础设施安全性和对持续改进的承诺，AnyParser 本地使组织能够利用先进的文档解析技术，同时保持对敏感数据的完全控制。

## 行动呼吁

对于希望在不妥协安全性的情况下转变文档工作流程的组织，AnyParser 本地提供了一种强大而安全的解决方案。立即联系 CambioML [安排演示](https://www.cambioml.com/book-demo) 或 [开始试用](https://www.cambioml.com/sandbox)，体验安全、高效文档解析的好处。
