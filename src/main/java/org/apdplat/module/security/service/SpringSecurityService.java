package org.apdplat.module.security.service;

import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.service.ServiceFacade;
import org.apdplat.platform.util.FileUtils;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.access.intercept.DefaultFilterInvocationSecurityMetadataSource;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.util.AntPathRequestMatcher;
import org.springframework.security.web.util.RequestMatcher;
import org.springframework.stereotype.Service;

/**
 *Spring Security授权服务
 * @author sun
 */
@Service
public class SpringSecurityService {
    private static final APDPlatLogger LOG = new APDPlatLogger(SpringSecurityService.class);
    @Resource(name = "filterSecurityInterceptor")
    private  FilterSecurityInterceptor filterSecurityInterceptor;
    @Resource(name="serviceFacade")
    protected ServiceFacade serviceFacade;
    /**
     *
     * @return 系统是否启用安全机制
     */
    public static boolean isSecurity(){
        String security=PropertyHolder.getProperty("security");
        if(security!=null && "true".equals(security.trim())){
            return true;
        }
        return false;
    }
    /**
     * 初始化系统安全拦截信息
     */
 //   @PostConstruct
    public  void initSecurityConfigInfo(){
        String security=PropertyHolder.getProperty("security");
        if(security==null || !"true".equals(security.trim())){
            LOG.info("当前系统禁用安全机制");
            return ;
        }
        
        
        LOG.info("开始初始化权限子系统...");
        //核心对象，一切url和角色的绑定都围绕它进行
        //指定了哪些url可以由哪些角色来访问
        LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>> requestMap =new LinkedHashMap<>();
        
        
        //普通管理员
        SecurityConfig manager=new SecurityConfig("ROLE_MANAGER");
        //超级管理员
        SecurityConfig superManager=new SecurityConfig("ROLE_SUPERMANAGER");
        //value具有超级管理员 或是 普通管理员权限
        //这里需要注意 文本大写表示的角色标识 要转换为ConfigAttribute的集合
        //在绑定url路径和角色的关系的时候，url路径还分GET和POST两种情况
        Collection<ConfigAttribute> value=new ArrayList<>();
        value.add(manager);
        value.add(superManager);
        
        
 //1、处理特殊的url访问规则       
        //urls里面存放了特殊的URL访问规则
        Collection<String> urls=new LinkedHashSet<>(); 
        //urlFiles为多个文本文件
        String[] urlFiles=PropertyHolder.getProperty("manager.default.url").split(",");
        for(String urlFile : urlFiles){
            //获取url访问规则文本文件的内容
            Collection<String> url=FileUtils.getClassPathTextFileContent(urlFile);
            urls.addAll(url);
        }
        //url为这样的格式：
        //格式1：/**/login.jsp*=ROLE_ANONYMOUS,ROLE_MANAGER,ROLE_SUPERMANAGER
        //格式2：/**/platform/**
        //格式1含义解释：匿名用户、普通管理员、超级管理员都可以访问的路径
        //格式2含义解释：超级管理员 或是 普通管理员都可以访问的路径
        for(String url : urls){
            //格式1：url中指定了只有特定角色才能访问
            if(url.contains("=")){
                String[] attr=url.split("=");
                //真正的url
                url=attr[0];
                //可有多个角色
                String[] roles=attr[1].split(",");
                //把多个角色转换为ConfigAttribute的集合
                Collection<ConfigAttribute> v=new ArrayList<>();
                for(String role : roles){
                    v.add(new SecurityConfig(role));
                }
                //POST
                RequestMatcher key=new AntPathRequestMatcher(url,"POST");
                requestMap.put(key, v);
                //GET
                key=new AntPathRequestMatcher(url,"GET");
                requestMap.put(key, v);
            }
            //格式2：超级管理员 或是 普通管理员都可以访问
            else{
                //POST
                RequestMatcher key=new AntPathRequestMatcher(url,"POST");
                requestMap.put(key, value);
                //GET
                key=new AntPathRequestMatcher(url,"GET");
                requestMap.put(key, value);
            }
        }

  //菜单调整及action的访问路径改为在xml中自定义配置后，这种动态指定模式不使用了，想改为只要登录系统就可访问，如果后续需要更严格的访问控制，再改造。@20140910      
 //2、动态指定系统中模块及命令的url访问规则        
        //遍历所有的Command对象
/*        for(Command command : serviceFacade.query(Command.class).getModels()){
            List<String> paths=ModuleService.getCommandPath(command);
            //命令访问路径到角色名称的映射
            Map<String,String> map=ModuleService.getCommandPathToRole(command);
            for(String path : paths){
                //POST
                RequestMatcher key=new AntPathRequestMatcher(path.toString().toLowerCase()+".action*","POST");
                value=new ArrayList<>();
*/
                //要把路径转换为角色
                //如：命令路径：/**/security/user!query 映射角色：_SECURITY_USER_QUERY
/*               value.add(new SecurityConfig("ROLE_MANAGER"+map.get(path)));
                value.add(superManager);
                requestMap.put(key, value);
                //GET
                key=new AntPathRequestMatcher(path.toString().toLowerCase()+".action*","GET");
                requestMap.put(key, value);
            }
        }
 */
        
 //3、超级管理员对所有的POST操作具有权限
        RequestMatcher key=new AntPathRequestMatcher("/**","POST");
        //value为超级管理员
        value=new ArrayList<>();
        value.add(superManager);
        value.add(manager);		//由于不能按照之前的模式动态指定url的访问规则，所以这里暂时改为只要登录系统就可以访问url了 @20140910sy
        requestMap.put(key, value);
        
        
 //4、超级管理员对所有的GET操作具有权限
        key=new AntPathRequestMatcher("/**","GET");
        requestMap.put(key, value);        

        DefaultFilterInvocationSecurityMetadataSource source=new DefaultFilterInvocationSecurityMetadataSource(requestMap);
        
        filterSecurityInterceptor.setSecurityMetadataSource(source);

        /*LOG.debug("system privilege info:\n");
        for(Map.Entry<RequestMatcher, Collection<ConfigAttribute>> entry : requestMap.entrySet()){
            LOG.debug(entry.getKey().toString());
            for(ConfigAttribute att : entry.getValue()){
                LOG.debug("\t"+att.toString());
            }
        }*/
        LOG.info("完成初始化权限子系统...");
    }
}