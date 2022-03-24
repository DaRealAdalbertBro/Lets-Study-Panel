<?php

class Encryption {

    protected $encryptMethod = 'AES-256-CBC';

    public function decrypt($encryptedString, $key)
    {
        $json = json_decode(base64_decode($encryptedString), true);

        try {
            $salt = hex2bin($json["salt"]);
            $iv = hex2bin($json["iv"]);
        } catch (Exception $e) {
            return null;
        }

        $cipherText = base64_decode($json['ciphertext']);

        $iterations = intval(abs((int) $json['iterations']));
        if ($iterations <= 0) {
            $iterations = 999;
        }
        $hashKey = hash_pbkdf2('sha512', $key, $salt, $iterations, ($this->encryptMethodLength() / 256));
        unset($iterations, $json, $salt);

        $decrypted= openssl_decrypt($cipherText , $this->encryptMethod, hex2bin($hashKey), OPENSSL_RAW_DATA, $iv);
        unset($cipherText, $hashKey, $iv);

        return $decrypted;
    }
    public function encrypt($string, $key)
    {
        $ivLength = openssl_cipher_iv_length($this->encryptMethod);
        $iv = openssl_random_pseudo_bytes($ivLength);

        $salt = openssl_random_pseudo_bytes(256);
        $iterations = 999;
        $hashKey = hash_pbkdf2('sha512', $key, $salt, $iterations, ($this->encryptMethodLength() / 256));

        $encryptedString = openssl_encrypt($string, $this->encryptMethod, hex2bin($hashKey), OPENSSL_RAW_DATA, $iv);

        $encryptedString = base64_encode($encryptedString);
        unset($hashKey);

        $output = ['ciphertext' => $encryptedString, 'iv' => bin2hex($iv), 'salt' => bin2hex($salt), 'iterations' => $iterations];
        unset($encryptedString, $iterations, $iv, $ivLength, $salt);

        return base64_encode(json_encode($output));
    }
    protected function encryptMethodLength()
    {
        $number = (int) filter_var($this->encryptMethod, FILTER_SANITIZE_NUMBER_INT);

        return (int) abs(intval($number));
    }
    public function setCipherMethod($cipherMethod)
    {
        $this->encryptMethod = $cipherMethod;
    }


}

?>