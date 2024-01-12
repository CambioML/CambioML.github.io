'use client';

import PageHero from "@/app/components/hero/PageHero";
import Container from "../../../components/Container";
import SolutionsCard from "../../../components/solutions/SolutionsCard";
import Section from "@/app/components/Section";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";

const Solutions = [
    {
        title: "AutoRater Use Case 1",
        description: "Use uniflow for AutoRater.",
        url: "https://www.cambioml.com",
        image: ""
    },
]

const AutoRaterSolutionsPage = () => {
    const router = useRouter();
    return (
        <div className="pb-10 w-full h-full">
            <PageHero title="AutoRater" description="Get Auto Compliant with LLMs" />
            <div className="flex flex-col items-center justify-center py-20">
                <Section title="Automate your AutoRater process with AI raters" paragraphs={["Are you worried about AutoRater or risk for your private LLMs? We offer a specialized AutoRater LLM for regulatory AutoRater and risk management. This system automatically monitors regulatory changes and aligns them with your internal policies and controls, ensuring timely tracking, response, and reporting on significant regulations and requirements."]} center />
            </div>
        </div>
    )
}

export default AutoRaterSolutionsPage;