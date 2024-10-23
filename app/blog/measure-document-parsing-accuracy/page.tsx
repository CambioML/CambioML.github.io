import Blog from '@/app/components/blog/Blog';
import BlogImage from '@/app/components/blog/BlogImage';
import BlogLaTeX from '@/app/components/blog/BlogLaTeX';
import BlogLink from '@/app/components/blog/BlogLink';
import BlogList from '@/app/components/blog/BlogListItem';
import BlogParagraph from '@/app/components/blog/BlogParagraph';
import BlogSectionTitle from '@/app/components/blog/BlogSectionTitle';
import BlogSeparator from '@/app/components/blog/BlogSeparator';

const Page = () => {
  return (
    <Blog
      title="Evaluating Your Parsing Solution: A Comparative Look at PDF to Markdown Conversion"
      authors={[{ name: 'Rachel', companyName: 'CambioML', companyUrl: 'https://www.cambioml.com' }]}
      publishedOn="October 10, 2024"
    >
      <BlogParagraph>
        Converting complex PDFs into Markdown can be challenging. There are plenty of open-source libraries available to
        extract text from pdf, but when it comes to PDFs containing complex elements like tables and charts, the results
        often fall short. Popular large language models like GPT or Claude can handle these tasks but tend to be slow
        and sometimes produce inaccurate outputs. Traditional OCR tools, while effective for simpler documents, often
        struggle with maintaining the exact structure and semantic meaning of the original content. On the other hand,
        vision-language models sometimes hallucinate, leading to erroneous parsing results. This blog will explain what
        does parse mean and detail the results of a comparative analysis of multiple models using multiple metrics.
      </BlogParagraph>
      <BlogSectionTitle title="What does parse mean?" />
      <BlogParagraph>
        In the context of PDF parsing, &quot;parse&quot; refers to the process of extracting specific data from a PDF
        file using specialized software known as a PDF parser. A PDF parser analyzes the content of a PDF document and
        identifies elements such as text, images, fonts, layouts, and even metadata. The extracted data can then be
        organized and exported into different formats like XML, JSON, or Excel/CSV, which can be used for various
        purposes such as data analysis, record keeping, or automation of workflows.
      </BlogParagraph>
      <BlogParagraph>
        Understanding what does parse mean is essential for evaluating the effectiveness of a parsing solution,
        especially when comparing different PDF to Markdown conversion tools, as pdf parser involves more than just
        simple text extraction—it requires recognizing and maintaining the document&apos;s semantic structure.
      </BlogParagraph>
      <BlogSectionTitle title="How do we measure the quality of these parsing solutions?" />
      <BlogParagraph>
        We&apos;ve defined a series of word-level metrics to assess the performance of different models, focusing on key
        factors like:
      </BlogParagraph>
      <BlogList
        items={[
          {
            label: 'Precision, Recall, and F-Measure',
            content: 'Evaluating the quality and completeness of parsing.',
          },
          {
            label: 'BLEU Score and ANLS',
            content: 'Useful for evaluating language and layout structure.',
          },
          {
            label: 'Edit Distance, Jenson-Shannon Divergence, and Jaccard Distance',
            content:
              'Metrics specific to the OCR domain, particularly helpful for understanding the exactness of content reproduction.',
          },
        ]}
      />
      <BlogParagraph>
        Our vision-language model, <strong>AnyParser</strong>, demonstrates exceptional performance, combining speed and
        accuracy, especially on complex layouts with tables and semantic elements.{' '}
        <strong>AnyParser outperforms other solutions</strong>, offering a 20x speed improvement over models like
        GPT/Claude while achieving higher accuracy.
      </BlogParagraph>
      <BlogSectionTitle title="An extensive comparison result against leading parsing models" />
      <BlogSectionTitle title="Statistical object" secondary />
      <BlogParagraph>
        To truly showcase the capabilities of AnyParser, we conducted an extensive comparison against leading parsing
        models in the industry and well-known Large Language Models (LLMs). Our evaluation included:
      </BlogParagraph>
      <BlogSectionTitle title="1. Large Language Models" tertiary />
      <BlogList
        items={[
          {
            content: 'AnyParser',
          },
          {
            content: "OpenAI's GPT-4o",
          },
          {
            content: "Google's Gemini 1.5 Pro",
          },
          {
            content: "Anthropic's Claude 3.5 Sonnet",
          },
        ]}
      />
      <BlogSectionTitle title="1. OCR-based Services" tertiary />
      <BlogList
        items={[
          {
            content: 'LlamaParse',
          },
          {
            content: 'Amazon Textract',
          },
          {
            content: 'Google Cloud Document AI',
          },
          {
            content: ' Azure Document Intelligence',
          },
        ]}
      />
      <BlogSectionTitle title="Result presentation and analysis" secondary />
      <BlogSectionTitle title="Experiment 1" tertiary underline />
      <BlogParagraph>
        First, we conduct a series of rigorous comparison of the performance of different document AI models on over 5
        metrics below: BLEU, Precision and recall, F-Measure and ANLS. You can find the mathematical definition of these
        definition in the appendix.
      </BlogParagraph>
      <BlogParagraph>
        The models compared are: AnyParser, Textract, lama-Parse, Premium Llama-Parse, GPT4o, Gemini-1.5-pro, GCP-DocAl,
        and Azure-DocAl.
      </BlogParagraph>
      <BlogImage src="measure-document-parsing-accuracy-1.png" alt="Document AI model Comparison" />
      <BlogParagraph>
        BLEU is used as an assessment of the quality of bilingual interpreting to test the quality of the models in
        processing utterances. By comparing the results of these parsing models under the BLEU assessment method, we
        find that: the scores of AnyParser and Premium Llama-Parse are significantly higher than the scores of the other
        models, Amazon Textract scores the lowest, and the results of the scores of the other models are in the middle
        of a relatively average level.x
      </BlogParagraph>
      <BlogParagraph>
        Recognition accuracy is usually represented by precision and recall, where precision represents the percentage
        of truly correct results among the results judged as correct by the model, and recall represents the percentage
        of truly correctly judged results by the model among all actually correct results. By comparing the precision
        and recall of these parsing models, we find that: except for Llama-Parse, GPT4o and Gemini-1.5-pro, all other
        models are at a high level. Among them, AnyParser and Amazon Textract are more prominent in precision, and
        AnyParser and Premium Llama-Parse are more prominent in recall. The higher score of the model on Precision
        indicates that the model outputs more correct information in the production results, and the higher score on
        recall indicates that the model is more capable of obtaining correct information from the sample. The results of
        the scores show that AnyParser has a clear advantage in terms of recognition accuracy to extract text from pdf.
      </BlogParagraph>
      <BlogParagraph>
        F-Measure is a comprehensive evaluation index of precision and recall on these two indicators. By comparing the
        scores of these parsing models under F-Measure, we can see more intuitively that the five models, AnyParser,
        Amazon Textract, Premium Llama-Parse, GCP-DocAI and Azure-DocAI, have a better strength in terms of recognition
        accuracy compared with other models. We can see more intuitively that the five models have more strength in
        recognition accuracy than the other models, and AnyParser has the highest score under F-Measure, which further
        illustrates the obvious advantage of AnyParser in recognition accuracy to extract text from pdf.
      </BlogParagraph>
      <BlogParagraph>
        ANLS, as a commonly used evaluation index when it comes to measuring the accuracy and similarity between the
        original text and the target text at the character level, is also very informative for measuring the parsing
        level of the models. The higher scores of AnyParser, Premium Llama-Parse and Azure-DocAI reflect the higher
        parsing level of these models compared to the other models.
      </BlogParagraph>
      <BlogParagraph>Overall, AnyParser and Premium Llama-Parse outperform the other models. </BlogParagraph>
      <BlogSectionTitle title="Experiment 2" tertiary underline />
      <BlogParagraph>
        We also compare the performance of different document AI models on three different metrics: Edit Distance,
        Jensen-Shannon Divergence, and Jaccard Distance. The metrics are used to measure the similarity between the
        output of the models and a reference document. Lower values indicate better performance.
      </BlogParagraph>
      <BlogImage
        src="measure-document-parsing-accuracy-2.png"
        alt="Document AI model Comparison for Edit Distance, Jensen-Shannon Divergence, and Jaccard Distance"
      />
      <BlogParagraph>Here are some key observations from the chart:</BlogParagraph>
      <BlogList
        items={[
          {
            label: 'Edit Distance',
            content:
              'The models AnyParser and Premium Llama-Parse perform the best with the lowest edit distance, suggesting that their output were closest to the reference document.',
          },
          {
            label: 'Jensen-Shannon Divergence',
            content:
              'The models AnyParser and Premium Llama-Parse have the lowest divergence, implying that their outputs are most similar to the reference document in terms of word distribution.',
          },
          {
            label: 'Jaccard Distance',
            content:
              'Beyond Llama-parse, GPT4O, Gemini-1.5, all the other model perform decent with the lowest Jaccard distance, indicating that their output have the highest overlap with the reference document in terms of the set of words used.',
          },
        ]}
      />
      <BlogSectionTitle title="Conclusion" secondary />
      <BlogParagraph>
        Overall, our rigorous testing suggests that AnyParser and Premium Llama-Parse generally performs well across
        various metrics, indicating its potential for accurate document processing. From the plots, we can see
        traditional OCR models such as the famous Amazon Textract score much lower than vision language models. However,
        the performance of different models varies depending on the metric used, highlighting the importance of
        considering multiple evaluation criteria when comparing AI models.
      </BlogParagraph>
      <BlogSectionTitle title="Introducing Our Open-Source Evaluation Pipeline" />
      <BlogParagraph>
        To streamline evaluations, we&apos;ve created an evaluation pipeline that provides an industry-standard method
        for comparing parsing models. In our example, we demonstrate its use in the HR domain, where resume parsing is
        common. We built a diverse synthetic dataset of 128 resumes, generated using paired image-Markdown files. Using
        GPT-4, we generated HTML content, rendered it to images, and used the extracted text as ground truth for
        comparison.
      </BlogParagraph>
      <BlogParagraph>
        And here&apos;s the best part: we&apos;ve open-sourced this evaluation framework on GitHub! Whether you are a
        developer or a business user, our pipeline enables you to evaluate and compare the parsing quality of different
        models on your own dataset.
      </BlogParagraph>
      <BlogParagraph>
        Find the quickstart guide in the{' '}
        <BlogLink url="https://github.com/CambioML/cambio-evaluation" text="Github repo" /> and see how different
        parsing models stack up against each other. We believe that by showcasing our model&apos;s strength in the open,
        we can attract more users who want reliable, fast, and accurate parsing capabilities.
      </BlogParagraph>
      <BlogSeparator />
      <BlogSectionTitle title="Appendix - Metrics" />
      <BlogSectionTitle title="1. Precision" secondary />
      <BlogParagraph>
        Precision measures the accuracy of the parsed content, showing how many of the retrieved elements were correct.
        In parsing, it&apos;s the proportion of correctly extracted words out of all words extracted.
      </BlogParagraph>
      <BlogLaTeX
        latex={`\\text{Precision} = \\frac{\\text{True Positives (TP)}}{\\text{True Positives (TP) + False Positives (FP)}}`}
      />
      <BlogList
        items={[
          {
            label: 'True Positives (TP)',
            content: 'Words correctly identified by the parser.',
          },
          {
            label: 'False Positives (FP)',
            content: 'Words incorrectly identified by the parser.',
          },
        ]}
      />

      <BlogSectionTitle title="2. Recall" secondary />
      <BlogParagraph>
        Recall indicates the completeness of the parsing, or how many relevant words from the original document were
        retrieved.
      </BlogParagraph>
      <BlogLaTeX
        latex={`\\text{Recall} = \\frac{\\text{True Positives (TP)}}{\\text{True Positives (TP) + False Negatives (FN)}}`}
      />
      <BlogList
        items={[
          { label: 'False Negatives (FN)', content: 'Words in the original document that were missed by the parser.' },
        ]}
      />

      <BlogSectionTitle title="3. F-Measure (F1 Score)" secondary />
      <BlogParagraph>
        The F1 Score is the harmonic mean of Precision and Recall, balancing both metrics to give an overall measure of
        parsing quality.
      </BlogParagraph>
      <BlogLaTeX
        latex={`\\text{F1 Score} = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}`}
      />
      <BlogSectionTitle title="4. BLEU Score (Bilingual Evaluation Understudy) " secondary />
      <BlogParagraph>
        The BLEU score measures the similarity between the parsed content and the original text, placing special
        emphasis on the order of words. It&apos;s particularly useful for evaluating language and structure consistency
        in parsed documents, as it penalizes outputs that differ in sequence from the original.
      </BlogParagraph>
      <BlogSectionTitle title="5. ANLS (Average Normalized Levenshtein Similarity)" secondary />
      <BlogParagraph>
        ANLS quantifies the similarity between the parsed content and the original, using normalized edit distance.
        It&apos;s calculated by averaging the Normalized Levenshtein Similarity (NLS) for each word pair in the parsed
        and reference texts. The NLS is computed as follows:
      </BlogParagraph>
      <BlogLaTeX
        latex={`\\text{NLS} = 1 - \\frac{\\text{Levenshtein Distance (LD)}(\\text{parsed word}, \\text{original word})}{\\max(\\text{Length of parsed word}, \\text{Length of original word})}`}
      />
      <BlogParagraph>Then, the ANLS is the average of NLS across all word pairs:</BlogParagraph>
      <BlogLaTeX latex={`\\text{ANLS} = \\frac{1}{N} \\sum_{i=1}^{N} \\text{NLS}_i`} />
      <BlogSectionTitle title="6. Edit Distance" secondary />
      <BlogParagraph>
        Edit Distance calculates the number of word-level operations (insertions, deletions, substitutions) required to
        convert the parsed text to the original.
      </BlogParagraph>
      <BlogLaTeX
        latex={`D(X, Y) = \\begin{cases} 0 & \\text{if } m = 0 \\text{ and } n = 0 \\\\ D(X_{1:m-1}, Y) + 1 & \\text{if } m > 0 \\text{ and } n = 0 \\\\ D(X, Y_{1:n-1}) + 1 & \\text{if } m = 0 \\text{ and } n > 0 \\\\ \\min \\begin{cases} D(X_{1:m-1}, Y_{1:n-1}) + \\delta(X_m, Y_n) \\ D(X_{1:m-1}, Y) + 1 \\\\ D(X, Y_{1:n-1}) + 1 \\end{cases} & \\text{otherwise} \\end{cases}`}
      />
      <BlogSectionTitle title="7. Jensen-Shannon Divergence" secondary />
      <BlogParagraph>
        Jensen-Shannon Divergence measures the similarity between discrete probability distributions of parsed and
        original word counts, highlighting differences in word frequency.
      </BlogParagraph>
      <BlogLaTeX
        latex={`
\\text{JSD}(P \\parallel Q) = \\frac{1}{2} \\text{KL}(P \\parallel M) + \\frac{1}{2} \\text{KL}(Q \\parallel M) \\text{ where } M = \\frac{1}{2}(P + Q), \\text{ and } \\text{KL}(P \\parallel Q) \\\\ \\text{ is the Kullback-Leibler divergence given by:}

\\text{KL}(P \\parallel Q) = \\sum_{i} P(i) \\log \\frac{P(i)}{Q(i)}
`}
      />
      <BlogSectionTitle title="8. Jaccard Distance" secondary />
      <BlogParagraph>
        Jaccard Distance measures the dissimilarity between sets of words in parsed and original content, useful for
        assessing word overlap.
      </BlogParagraph>
      <BlogLaTeX
        latex={`\\text{Jaccard Distance} = 1 - \\frac{|A \\cap B|}{|A \\cup B|}
\\\\ \\text{where } |A \\cap B| \\text{ is the number of common elements between } A \\text{ and } B,
\\\\ \\text{and } |A \\cup B| \\text{ is the total number of unique elements in both sets.}
`}
      />
    </Blog>
  );
};

export default Page;
