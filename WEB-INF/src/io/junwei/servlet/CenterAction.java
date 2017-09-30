package io.junwei.servlet;

import java.io.IOException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 
 */

public class CenterAction extends HttpServlet {
	private static final long serialVersionUID = -1491100722393864319L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		Map map = req.getParameterMap();
		Set<String> set = map.keySet();
		for (String key : set) {
			String[] ss = (String[]) map.get(key);
			StringBuffer sb = new StringBuffer();
			for (String s : ss) {
				sb.append(s);
			}
			// 查看前端是否传递正确参数
			System.err.println(key+"::::"+sb.toString());
		}
		resp.getWriter().write("");
	}
	
}
