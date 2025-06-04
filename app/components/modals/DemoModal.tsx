'use client';

import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useDemoModal from '@/app/hooks/useDemoModal';
import FormModal from './FormModal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import TextArea from '../inputs/TextArea';
import { useTranslation } from '@/lib/use-translation';

const DemoModal = () => {
  const DemoModal = useDemoModal();
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
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';

    const templateParams = {
      from_name: data.name,
      to_name: 'Cambio',
      email: data.email,
      message: data.message,
      request_type: 'Demo',
    };

    try {
      setIsLoading(true);
      await emailjs.send(serviceId, templateId, templateParams);
      toast.success(t.bookDemo.sent);
      DemoModal.onClose();
    } catch (error) {
      toast.error(t.bookDemo.error);
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title={t.bookDemo.title} subtitle="" center />
      <Input id="name" label={t.bookDemo.form.name} disabled={isLoading} register={register} errors={errors} required />
      <Input
        id="email"
        label={t.bookDemo.form.email}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea id="message" label={t.bookDemo.form.message} disabled={isLoading} register={register} errors={errors} />
    </div>
  );

  return (
    <FormModal
      disabled={isLoading}
      isOpen={DemoModal.isOpen}
      title=""
      actionLabel={t.bookDemo.form.submit}
      onClose={DemoModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default DemoModal;
