import { BASE_API } from "@/lib/environtment";
import { TokensType } from "@/types/tokens_type";
import {
  addToast,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { FC, useState } from "react";

import Cookies from "js-cookie";
import { ResponseType } from "@/types/response_type";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: FC<LoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const res = await fetch(BASE_API + "/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        })
        if (res.ok) {
          const { body }: { body?: TokensType } = await res.json() as ResponseType;
          if (!body) {
            addToast({
              title: "Login failed.",
              description: "Something went wrong, please try again.",
              color: "danger"
            });
            return;
          }
          Cookies.set("access_token", body.access_token, {
            expires: 7 / 24,
          });
          Cookies.set("refresh_token", body.refresh_token, {
            expires: 7,
          });
          window.location.reload();
          onClose()
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      addToast({
        title: "Google login failed.",
        description: "Please try again later.",
        color: "danger"
      });
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Masuk ke RagaMaya
              </h2>
              <p className="text-sm text-gray-600">
                Gunakan akun Google Anda untuk melanjutkan
              </p>
            </ModalHeader>

            <ModalBody className="py-6">
              <Button
                className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                startContent={
                  <Image
                    alt="Google Logo"
                    src="/assets/google.svg"
                    width={22}
                    height={22}
                    className="mr-2"
                  />
                }
                onPress={() => handleLogin()}
                isLoading={isLoading}
              >
                Masuk dengan Google
              </Button>
            </ModalBody>

            <ModalFooter className="flex-col gap-2">
              <p className="text-xs text-gray-500 text-center">
                Dengan masuk, Anda menyetujui{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Kebijakan Privasi
                </Link>{" "}
                kami.
              </p>
              <Button
                onPress={onClose}
                className="bg-gray-800 text-white font-semibold"
              >
                Kembali
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
