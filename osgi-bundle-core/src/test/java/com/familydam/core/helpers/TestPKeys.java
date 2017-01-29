package com.familydam.core.helpers;

import org.junit.Assert;
import org.junit.Test;

import javax.crypto.Cipher;
import java.io.*;
import java.nio.file.Files;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

/**
 * Created by mike on 1/27/17.
 */
public class TestPKeys
{
    String ALGORITHM = "RSA";
    String PRIVATE_KEY_FILE_PATH = "target/private.key";
    String PUBLIC_KEY_FILE_PATH = "target/public.key";


    byte[] privateBytes64 = null;
    byte[] publicBytes64 = null;
    //RSA/None/OAEPWithSHA1AndMGF1Padding



    @Test
    public void doAll() throws Exception
    {
        generateKey();

        PublicKey publicKey = loadPublicKey();
        PrivateKey privateKey = loadPrivateKey();

        String originalText = "Text to be encrypted!";
        final byte[] cipherText = encrypt(originalText, publicKey);
        final String plainText = decrypt(cipherText, privateKey);

        // Printing the Original, Encrypted and Decrypted Text
        System.out.println("Original: " + originalText);
        System.out.println("Encrypted: " +cipherText.toString());
        System.out.println("Decrypted: " + plainText);

        Assert.assertEquals(originalText, plainText);
    }


    @Test
    public void doAllBase64() throws Exception
    {
        generateKey();

        PublicKey publicKey = loadPublicKey(publicBytes64);
        PrivateKey privateKey = loadPrivateKey(privateBytes64);

        String originalText = "Text to be encrypted! - Text to be encrypted!";
        final byte[] cipherText = encrypt(originalText, publicKey);
        final String plainText = decrypt(cipherText, privateKey);

        // Printing the Original, Encrypted and Decrypted Text
        System.out.println("Original: " + originalText);
        System.out.println("Encrypted: " +cipherText.toString());
        System.out.println("Decrypted: " + plainText);

        Assert.assertEquals(originalText, plainText);
    }



    public byte[] encrypt(String text, PublicKey key) {
        byte[] cipherText = null;
        try {
            // get an RSA cipher object and print the provider
            final Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA1AndMGF1Padding");
            // encrypt the plain text using the public key
            cipher.init(Cipher.ENCRYPT_MODE, key);
            cipherText = cipher.doFinal(text.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return cipherText;
    }


    public String decrypt(byte[] text, PrivateKey key) {
        byte[] dectyptedText = null;
        try {
            // get an RSA cipher object and print the provider
            final Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA1AndMGF1Padding");

            // decrypt the text using the private key
            cipher.init(Cipher.DECRYPT_MODE, key);
            dectyptedText = cipher.doFinal(text);

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return new String(dectyptedText);
    }



    public void generateKey()
    {
        try {

            final KeyPairGenerator keyGen = KeyPairGenerator.getInstance(ALGORITHM);
            keyGen.initialize(2048);
            final KeyPair key = keyGen.generateKeyPair();

            //save keys
            privateBytes64 = writePrivateFile(key);
            publicBytes64 = writePublicFile(key);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public byte[] writePrivateFile(KeyPair key) throws IOException,NoSuchAlgorithmException
    {
        File privateKeyFile = null;
        FileOutputStream privateKeyOutputStream = null;
        try {
            privateKeyFile = new File(PRIVATE_KEY_FILE_PATH);

            privateKeyOutputStream = new FileOutputStream(privateKeyFile);
            privateKeyOutputStream.write(key.getPrivate().getEncoded());


            return Base64.getEncoder().encode(key.getPrivate().getEncoded());

        } finally {
            if (privateKeyOutputStream != null) privateKeyOutputStream.close();
        }

    }



    public byte[] writePublicFile(KeyPair key) throws IOException
    {
        File publicKeyFile = null;
        FileOutputStream publicKeyOutputStream = null;
        try {

            publicKeyFile = new File(PUBLIC_KEY_FILE_PATH);

            publicKeyOutputStream = new FileOutputStream(publicKeyFile);
            publicKeyOutputStream.write(key.getPublic().getEncoded());

            return Base64.getEncoder().encode(key.getPublic().getEncoded());

        } finally {
            if (publicKeyOutputStream != null) publicKeyOutputStream.close();
        }

    }




    /**
     * Encrypt the string using the public key
     * @return
     * @throws Exception
     */
    public PublicKey loadPublicKey() throws Exception
    {
        File publicKeyFile = new File(PUBLIC_KEY_FILE_PATH);

        byte[] keyBytes = Files.readAllBytes(new File(PUBLIC_KEY_FILE_PATH).toPath());

        KeyFactory kf = KeyFactory.getInstance(ALGORITHM); // or "EC" or whatever
        PublicKey publicKey = kf.generatePublic(new X509EncodedKeySpec(keyBytes));

        return publicKey;
    }

    public PublicKey loadPublicKey(byte[] bytes) throws Exception
    {
        byte[] decodedBytes = Base64.getDecoder().decode(bytes);
        KeyFactory kf = KeyFactory.getInstance(ALGORITHM); // or "EC" or whatever
        PublicKey publicKey = kf.generatePublic(new X509EncodedKeySpec(decodedBytes));

        return publicKey;
    }


    /**
     * Encrypt the string using the public key
     * @return
     * @throws Exception
     */
    public PrivateKey loadPrivateKey() throws Exception
    {
        File privateKeyFile = new File(PRIVATE_KEY_FILE_PATH);

        byte[] keyBytes = Files.readAllBytes(new File(PRIVATE_KEY_FILE_PATH).toPath());

        KeyFactory kf = KeyFactory.getInstance(ALGORITHM); // or "EC" or whatever
        PrivateKey privateKey = kf.generatePrivate(new PKCS8EncodedKeySpec(keyBytes));

        return privateKey;
    }

    public PrivateKey loadPrivateKey(byte[] bytes) throws Exception
    {
        byte[] decodedBytes = Base64.getDecoder().decode(bytes);
        KeyFactory kf = KeyFactory.getInstance(ALGORITHM); // or "EC" or whatever
        PrivateKey privateKey = kf.generatePrivate(new PKCS8EncodedKeySpec(decodedBytes));

        return privateKey;
    }
}
