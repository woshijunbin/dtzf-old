package io.junwei.servlet;

public class Main {

    public static void main(String[] args) {
        
//      .class�����쳣��  System.err.println(new String().class instanceof Class);
        
        // ����
        System.err.println(String.class == String.class);
        System.err.println(String.class == new String().getClass());
        
        // ���������ʼ����ȫ���Զ���ʼ�����ֲ�������ʾ��ʼ��
        
        // ����.class  �൱��  new Class<����>() 
    }
}
