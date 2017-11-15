package io.junwei.servlet;

public class Main {

    public static void main(String[] args) {
        
//      .class编译异常：  System.err.println(new String().class instanceof Class);
        
        // 单利
        System.err.println(String.class == String.class);
        System.err.println(String.class == new String().getClass());
        
        // 变量必须初始化。全局自动初始化，局部必须显示初始化
        
        // 类名.class  相当于  new Class<类名>() 
    }
}
