import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

const editUrlSchema = z.object({
  originalUrl: z.string().min(1, "URL is required").url("Please enter a valid URL"),
});

type EditUrlFormValues = z.infer<typeof editUrlSchema>;

type EditUrlModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditUrlFormValues) => Promise<void>;
  isPending: boolean;
  defaultUrl?: string;
};

export const EditUrlModal = ({ isOpen, onClose, onSubmit, isPending, defaultUrl }: EditUrlModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EditUrlFormValues>({
    resolver: zodResolver(editUrlSchema),
    defaultValues: { originalUrl: "" },
  });

  useEffect(() => {
    if (defaultUrl) {
      setValue("originalUrl", defaultUrl);
    }
  }, [defaultUrl, setValue]);

  const handleFormSubmit = async (data: EditUrlFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Original URL">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        <Input
          id="edit-url-original"
          label="Original URL"
          type="url"
          placeholder="https://example.com/updated-url"
          error={errors.originalUrl?.message}
          disabled={isPending}
          {...register("originalUrl")}
        />
        <Button
          type="submit"
          id="url-edit-submit"
          className="w-full"
          isLoading={isPending}
          disabled={isPending}
        >
          Update URL
        </Button>
      </form>
    </Modal>
  );
};
