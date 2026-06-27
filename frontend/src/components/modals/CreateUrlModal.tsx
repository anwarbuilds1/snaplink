import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

const urlSchema = z.object({
  originalUrl: z.string().min(1, "URL is required").url("Please enter a valid URL"),
  customAlias: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || (val.length >= 3 && val.length <= 30), {
      message: "Alias must be between 3 and 30 characters",
    })
    .refine((val) => !val || /^[a-zA-Z0-9_-]+$/.test(val), {
      message: "Alias must contain only alphanumeric characters, dashes, or underscores",
    }),
  expiresAt: z.string().optional(),
});

type CreateUrlFormValues = z.infer<typeof urlSchema>;

type CreateUrlModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUrlFormValues) => Promise<void>;
  isPending: boolean;
};

export const CreateUrlModal = ({ isOpen, onClose, onSubmit, isPending }: CreateUrlModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: { originalUrl: "", customAlias: "", expiresAt: "" },
  });

  const handleFormSubmit = async (data: CreateUrlFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shorten a New URL">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        <Input
          id="url-original"
          label="Original URL"
          type="url"
          placeholder="https://example.com/long-original-url"
          error={errors.originalUrl?.message}
          disabled={isPending}
          {...register("originalUrl")}
        />
        <Input
          id="url-alias"
          label="Custom Alias (Optional)"
          type="text"
          placeholder="my-custom-code"
          error={errors.customAlias?.message}
          disabled={isPending}
          {...register("customAlias")}
        />
        <Input
          id="url-expiry"
          label="Expiration Date (Optional)"
          type="datetime-local"
          error={errors.expiresAt?.message}
          disabled={isPending}
          {...register("expiresAt")}
        />
        <Button
          type="submit"
          id="url-create-submit"
          className="w-full"
          isLoading={isPending}
          disabled={isPending}
        >
          Create Short URL
        </Button>
      </form>
    </Modal>
  );
};
