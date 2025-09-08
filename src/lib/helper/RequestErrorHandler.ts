import { ErrorResponseData } from "@/models/RequestErrors";
import { toast } from "sonner";

export default function RequestErrorHandler(req: ErrorResponseData) {
  if (req.errors) {
    const errorMessages = Object.values(req.errors).flatMap(
      (errorArray) => errorArray
    );
    errorMessages.forEach((item: string) =>
      toast.error(item, { className: "bg-rose-500  text-white" })
    );
  }
  if (req.authentication) {
    req.authentication.forEach((item: string) =>
      toast.error(item, { className: "bg-rose-500  text-white" })
    );
  }
}
