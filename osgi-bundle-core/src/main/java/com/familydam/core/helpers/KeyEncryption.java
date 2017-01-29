package com.familydam.core.helpers;

import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.rmi.value.StringValue;
import org.apache.sling.jcr.resource.JcrResourceUtil;

import javax.crypto.Cipher;
import javax.jcr.*;
import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

/**
 * Created by mike on 1/26/17.
 */

public class KeyEncryption
{

    public static final String PUBLIC_KEY = "publicKey";
    public static final String PUBLIC_KEY_BASE64 = "publicKeyBase64";
    public static final String PRIVATE_KEY = "privateKey";
    public static final String PRIVATE_KEY_BASE64 = "privateKeyBase64";



    public byte[] encryptWithPublic(Node securityNode, Session adminSession, String stringToEncrypt) throws Exception {
        PublicKey key = readPublicKey(securityNode, adminSession);
        return encrypt(key, stringToEncrypt);
    }

    public byte[] encryptWithPrivate(Node securityNode, Session adminSession, String stringToEncrypt) throws Exception {
        PublicKey key = readPublicKey(securityNode, adminSession);
        return encrypt(key, stringToEncrypt);
    }

    private byte[] encrypt(Key key, String stringToEncrypt) throws Exception {
        byte[] cipherText = null;
        try {
            // get an RSA cipher object and print the provider
            final Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA1AndMGF1Padding");
            // encrypt the plain text using the public key
            cipher.init(Cipher.ENCRYPT_MODE, key);
            cipherText = cipher.doFinal(stringToEncrypt.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return cipherText;
    }



    public byte[] decryptWithPublic(Node securityNode, Session adminSession, byte[] stringToDecrypt) throws Exception
    {
        PublicKey key = readPublicKey(securityNode, adminSession);
        return decrypt(key, stringToDecrypt);
    }

    public byte[] decryptWithPrivate(Node securityNode, Session adminSession, byte[] stringToDecrypt) throws Exception
    {
        PrivateKey key = readPrivateKey(securityNode, adminSession);
        return decrypt(key, stringToDecrypt);
    }

    private byte[] decrypt(Key key, byte[] stringToDecrypt) throws UnsupportedEncodingException {
        byte[] dectyptedText = null;
        try {
            // get an RSA cipher object and print the provider
            final Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA1AndMGF1Padding");

            // decrypt the text using the private key
            cipher.init(Cipher.DECRYPT_MODE, key);
            dectyptedText = cipher.doFinal(stringToDecrypt);

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return dectyptedText;
    }



    public void generateKeys(Node securityNode, Session adminSession)
    {
        try {

            final KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048);
            final KeyPair key = keyGen.generateKeyPair();

            //save keys
            byte[] privateBytes64 = savePrivateKey(securityNode, adminSession, key);
            byte[] publicBytes64 = savePublicKey(securityNode, adminSession, key);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private byte[] savePrivateKey(Node securityNode, Session adminSession, KeyPair key) throws IOException,NoSuchAlgorithmException,RepositoryException
    {
        FileOutputStream publicKeyOutputStream = null;
        try {

            //save base 64
            String encodedKey = new String(Base64.getEncoder().encode(key.getPublic().getEncoded()), Charset.forName("UTF-8"));
            securityNode.setProperty(PRIVATE_KEY_BASE64, adminSession.getValueFactory().createValue(encodedKey));


            //Save file
            InputStream stream = new BufferedInputStream( new ByteArrayInputStream(key.getPublic().getEncoded()) );

            Node folder = securityNode;
            Node file = folder.addNode(PRIVATE_KEY,"nt:file");
            Node content = file.addNode("jcr:content","nt:resource");
            Binary binary = adminSession.getValueFactory().createBinary(stream);
            content.setProperty("jcr:data",binary);
            content.setProperty("jcr:mimeType","application/octet-stream");
            adminSession.save();


            return Base64.getEncoder().encode(key.getPublic().getEncoded());

        } finally {
            if (publicKeyOutputStream != null) publicKeyOutputStream.close();
        }

    }


    private byte[] savePublicKey(Node securityNode, Session adminSession, KeyPair key) throws IOException, RepositoryException
    {
        FileOutputStream publicKeyOutputStream = null;
        try {

            //save base 64
            String encodedKey = new String(Base64.getEncoder().encode(key.getPublic().getEncoded()), Charset.forName("UTF-8"));
            securityNode.setProperty(PUBLIC_KEY_BASE64, adminSession.getValueFactory().createValue(encodedKey));

            //save file
            InputStream stream = new BufferedInputStream( new ByteArrayInputStream(key.getPublic().getEncoded()) );

            Node folder = securityNode;
            Node file = folder.addNode(PUBLIC_KEY,"nt:file");
            Node content = file.addNode("jcr:content","nt:resource");
            Binary binary = adminSession.getValueFactory().createBinary(stream);
            content.setProperty("jcr:data",binary);
            content.setProperty("jcr:mimeType","application/octet-stream");
            adminSession.save();


            return Base64.getEncoder().encode(key.getPublic().getEncoded());

        } finally {
            if (publicKeyOutputStream != null) publicKeyOutputStream.close();
        }

    }



    private PublicKey readPublicKey(Node securityNode, Session adminSession) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException, RepositoryException
    {

        Node keyNode = securityNode.getNode("publicKey");
        Binary bin = adminSession.getNode("publicKey").getProperty("jcr:data").getBinary();
        InputStream stream = bin.getStream();

        DataInputStream dataIs = new DataInputStream(stream);
        byte[] keyBytes = new byte[stream.available()];
        dataIs.readFully(keyBytes);

        X509EncodedKeySpec publicSpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(publicSpec);
    }


    private PublicKey readBase64PublicKey(Node securityNode, Session adminSession, String key) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException, RepositoryException
    {
        byte[] keyBytes = Base64.getDecoder().decode(securityNode.getProperty("publicKeyBase64").getString());

        X509EncodedKeySpec publicSpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(publicSpec);
    }






    private PrivateKey readPrivateKey(Node securityNode, Session adminSession) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException, RepositoryException
    {

        Node keyNode = securityNode.getNode("privateKey");
        Binary bin = adminSession.getNode("privateKey").getProperty("jcr:data").getBinary();
        InputStream stream = bin.getStream();

        DataInputStream dataIs = new DataInputStream(stream);
        byte[] keyBytes = new byte[stream.available()];
        dataIs.readFully(keyBytes);

        PKCS8EncodedKeySpec publicSpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(publicSpec);
    }

    private PrivateKey readBase64PrivateKey(Node securityNode, Session adminSession, String key) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException, RepositoryException
    {
        byte[] keyBytes = Base64.getDecoder().decode(securityNode.getProperty("privateKeyBase64").getString());

        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(keySpec);
    }
}
