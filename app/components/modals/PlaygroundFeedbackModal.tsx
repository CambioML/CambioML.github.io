'use client';

import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import usePlaygroundFeedbackModal from '@/app/hooks/usePlaygroundFeedbackModal';
import Modal from './FormModal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import TextArea from '../inputs/TextArea';
import { useTranslation } from '@/lib/use-translation';

const PlaygroundFeedbackModal = () => {
  const PlaygroundFeedbackModal = usePlaygroundFeedbackModal();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_PLAYGROUND_TEMPLATE_ID || '';

    const templateParams = {
      from_name: data.name,
      to_name: 'Cambio Playground',
      email: data.email,
      message: data.message,
    };

    try {
      setIsLoading(true);
      await emailjs.send(serviceId, templateId, templateParams);
      toast.success(t.playground.feedback.successMessage);
      PlaygroundFeedbackModal.onClose();
    } catch (error) {
      toast.error(t.playground.feedback.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title={t.playground.feedback.title} subtitle="" center />
      <Input
        id="name"
        label={t.playground.feedback.nameLabel}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label={t.playground.feedback.emailLabel}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="message"
        label={t.playground.feedback.messageLabel}
        disabled={isLoading}
        register={register}
        errors={errors}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={PlaygroundFeedbackModal.isOpen}
      title=""
      actionLabel={t.playground.feedback.submitButton}
      onClose={PlaygroundFeedbackModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default PlaygroundFeedbackModal;
