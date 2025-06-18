---
title: 'Evaluating Your Parsing Solution: A Comparative Look at PDF to Markdown Conversion'
date: '2025-01-10'
keywords: 'PDF parsing,document parsing,AnyParser,vision language models,OCR,GPT,Claude,evaluation metrics,BLEU score,precision,recall,F-measure'
image: '/images/solutions/evaluate-document-parsing-accuracy-1.png'
---

Converting complex PDFs into Markdown can be challenging. There are plenty of open-source libraries available to extract text from pdf, but when it comes to PDFs containing complex elements like tables and charts, the results often fall short. Popular large language models like GPT or Claude can handle these tasks but tend to be slow and sometimes produce inaccurate outputs. Traditional OCR tools, while effective for simpler documents, often struggle with maintaining the exact structure and semantic meaning of the original content. On the other hand, vision-language models sometimes hallucinate, leading to erroneous parsing results. This blog will explain what does parse mean and detail the results of a comparative analysis of multiple models using multiple metrics.

## What does parse mean?

In the context of PDF parsing, "parse" refers to the process of extracting specific data from a PDF file using specialized software known as a PDF parser. A PDF parser analyzes the content of a PDF document and identifies elements such as text, images, fonts, layouts, and even metadata. The extracted data can then be organized and exported into different formats like XML, JSON, or Excel/CSV, which can be used for various purposes such as data analysis, record keeping, or automation of workflows.

Understanding what does parse mean is essential for evaluating the effectiveness of a parsing solution, especially when comparing different PDF to Markdown conversion tools, as pdf parser involves more than just simple text extraction—it requires recognizing and maintaining the document's semantic structure.

## How do we measure the quality of these parsing solutions?

We've defined a series of word-level metrics to assess the performance of different models, focusing on key factors like:

- **Precision, Recall, and F-Measure**: Evaluating the quality and completeness of parsing.

- **BLEU Score and ANLS**: Useful for evaluating language and layout structure.

- **Edit Distance, Jenson-Shannon Divergence, and Jaccard Distance**: Metrics specific to the OCR domain, particularly helpful for understanding the exactness of content reproduction.

Our vision-language model, **AnyParser**, demonstrates exceptional performance, combining speed and accuracy, especially on complex layouts with tables and semantic elements. **AnyParser outperforms other solutions**, offering a 20x speed improvement over models like GPT/Claude while achieving higher accuracy.

## An extensive comparison result against leading parsing models

### Statistical object

To truly showcase the capabilities of AnyParser, we conducted an extensive comparison against leading parsing models in the industry and well-known Large Language Models (LLMs). Our evaluation included:

#### 1. Large Language Models

- AnyParser
- OpenAI's GPT-4o
- Google's Gemini 1.5 Pro
- Anthropic's Claude 3.5 Sonnet

#### 2. OCR-based Services

- LlamaParse
- Amazon Textract
- Google Cloud Document AI
- Azure Document Intelligence

### Result presentation and analysis

#### Experiment 1

First, we conduct a series of rigorous comparison of the performance of different document AI models on over 5 metrics below: BLEU, Precision and recall, F-Measure and ANLS. You can find the mathematical definition of these definition in the appendix.

The models compared are: AnyParser-base, AnyParser-pro, Textract, Llama-Parse, GPT4o, Gemini-1.5-pro, GCP-DocAl, and Azure-DocAl.

![Document AI model Comparison](/images/solutions/evaluate-document-parsing-accuracy-1.png)

BLEU is used as an assessment of the quality of bilingual interpreting to test the quality of the models in processing utterances. By comparing the results of these parsing models under the BLEU assessment method, we find that: the scores of AnyParser-base and AnyParser-pro are significantly higher than the scores of the other models, Amazon Textract scores the lowest, and the results of the scores of the other models are in the middle of a relatively average level.

Recognition accuracy is usually represented by precision and recall, where precision represents the percentage of truly correct results among the results judged as correct by the model, and recall represents the percentage of truly correctly judged results by the model among all actually correct results. By comparing the precision and recall of these parsing models, we find that: except for Llama-Parse, GPT4o and Gemini-1.5-pro, all other models are at a high level. Among them, AnyParser and Amazon Textract are more prominent in precision, and AnyParser-base and AnyParser-pro are more prominent in recall. The higher score of the model on Precision indicates that the model outputs more correct information in the production results, and the higher score on recall indicates that the model is more capable of obtaining correct information from the sample. The results of the scores show that AnyParser has a clear advantage in terms of recognition accuracy to extract text from pdf.

F-Measure is a comprehensive evaluation index of precision and recall on these two indicators. By comparing the scores of these parsing models under F-Measure, we can see more intuitively that the five models, AnyParser-base, AnyParser-pro, Amazon Textract, GCP-DocAI and Azure-DocAI, have a better strength in terms of recognition accuracy compared with other models. We can see more intuitively that the five models have more strength in recognition accuracy than the other models, and AnyParser has the highest score under F-Measure, which further illustrates the obvious advantage of AnyParser in recognition accuracy to extract text from pdf.

ANLS, as a commonly used evaluation index when it comes to measuring the accuracy and similarity between the original text and the target text at the character level, is also very informative for measuring the parsing level of the models. The higher scores of AnyParser-base, AnyParser-pro and Azure-DocAI reflect the higher parsing level of these models compared to the other models.

Overall, AnyParser-base and AnyParser-pro outperform the other models.

#### Experiment 2

We also compare the performance of different document AI models on three different metrics: Edit Distance, Jensen-Shannon Divergence, and Jaccard Distance. The metrics are used to measure the similarity between the output of the models and a reference document. Lower values indicate better performance.

![Document AI model Comparison for Edit Distance, Jensen-Shannon Divergence, and Jaccard Distance](/images/solutions/evaluate-document-parsing-accuracy-2.png)

Here are some key observations from the chart:

- **Edit Distance**: The models AnyParser-base and AnyParser-pro perform the best with the lowest edit distance, suggesting that their output were closest to the reference document.

- **Jensen-Shannon Divergence**: The models AnyParser-base and AnyParser-pro have the lowest divergence, implying that their outputs are most similar to the reference document in terms of word distribution.

- **Jaccard Distance**: Beyond Llama-parse, GPT4O, Gemini-1.5, all the other model perform decent with the lowest Jaccard distance, indicating that their output have the highest overlap with the reference document in terms of the set of words used.

### Conclusion

Overall, our rigorous testing suggests that AnyParser-base and AnyParser-pro generally performs well across various metrics, indicating its potential for accurate document processing. From the plots, we can see traditional OCR models such as the famous Amazon Textract score much lower than vision language models. However, the performance of different models varies depending on the metric used, highlighting the importance of considering multiple evaluation criteria when comparing AI models.

## Introducing Our Open-Source Evaluation Pipeline

To streamline evaluations, we've created an evaluation pipeline that provides an industry-standard method for comparing parsing models. In our example, we demonstrate its use in the HR domain, where resume parsing is common. We built a diverse synthetic dataset of 128 resumes, generated using paired image-Markdown files. Using GPT-4, we generated HTML content, rendered it to images, and used the extracted text as ground truth for comparison.

And here's the best part: we've open-sourced this evaluation framework on GitHub! Whether you are a developer or a business user, our pipeline enables you to evaluate and compare the parsing quality of different models on your own dataset.

Find the quickstart guide in the Github repo and see how different parsing models stack up against each other. We believe that by showcasing our model's strength in the open, we can attract more users who want reliable, fast, and accurate parsing capabilities.

---

## Appendix - Metrics

### 1. Precision

Precision measures the accuracy of the parsed content, showing how many of the retrieved elements were correct. In parsing, it's the proportion of correctly extracted words out of all words extracted.

```
Precision = True Positives (TP) / (True Positives (TP) + False Positives (FP))
```

- **True Positives (TP)**: Words correctly identified by the parser.
- **False Positives (FP)**: Words incorrectly identified by the parser.

### 2. Recall

Recall indicates the completeness of the parsing, or how many relevant words from the original document were retrieved.

```
Recall = True Positives (TP) / (True Positives (TP) + False Negatives (FN))
```

- **False Negatives (FN)**: Words in the original document that were missed by the parser.

### 3. F-Measure (F1 Score)

The F1 Score is the harmonic mean of Precision and Recall, balancing both metrics to give an overall measure of parsing quality.

```
F1 Score = 2 × (Precision × Recall) / (Precision + Recall)
```

### 4. BLEU Score (Bilingual Evaluation Understudy)

The BLEU score measures the similarity between the parsed content and the original text, placing special emphasis on the order of words. It's particularly useful for evaluating language and structure consistency in parsed documents, as it penalizes outputs that differ in sequence from the original.

### 5. ANLS (Average Normalized Levenshtein Similarity)

ANLS quantifies the similarity between the parsed content and the original, using normalized edit distance. It's calculated by averaging the Normalized Levenshtein Similarity (NLS) for each word pair in the parsed and reference texts. The NLS is computed as follows:

```
NLS = 1 - (Levenshtein Distance (LD)(parsed word, original word)) / max(Length of parsed word, Length of original word)
```

Then, the ANLS is the average of NLS across all word pairs:

```
ANLS = (1/N) × Σ(NLS_i) for i=1 to N
```

### 6. Edit Distance

Edit Distance calculates the number of word-level operations (insertions, deletions, substitutions) required to convert the parsed text to the original.

### 7. Jensen-Shannon Divergence

Jensen-Shannon Divergence measures the similarity between discrete probability distributions of parsed and original word counts, highlighting differences in word frequency.

```
JSD(P || Q) = (1/2) × KL(P || M) + (1/2) × KL(Q || M)
where M = (1/2)(P + Q), and KL(P || Q) is the Kullback-Leibler divergence
```

### 8. Jaccard Distance

Jaccard Distance measures the dissimilarity between sets of words in parsed and original content, useful for assessing word overlap.

```
Jaccard Distance = 1 - |A ∩ B| / |A ∪ B|
where |A ∩ B| is the number of common elements between A and B,
and |A ∪ B| is the total number of unique elements in both sets.
```
