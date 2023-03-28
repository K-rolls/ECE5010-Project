import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";

//Hook for toasts, may be useful eventually for refactoring but currently unused

export function useToastHook() {
  const [state, setState] = useState(undefined);
  const toast = useToast();

  useEffect(() => {
    if (state) {
      const { message, status } = state;

      toast({
        title: status,
        description: message,
        status: status,
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  }, [state, toast]);

  return [state, setState];
}