import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import Link from "next/link";
import { FC } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleLogin: () => void;
}

export const LoginModal: FC<LoginModalProps> = ({
  isOpen,
  onClose,
  handleLogin,
}) => {
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
                onPress={handleLogin}
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
