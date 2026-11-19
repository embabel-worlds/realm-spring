package demo;
@Configuration(proxyBeanMethods = false)
public class LiteCfg {
    @Bean
    private Svc hiddenButAllowed() { return new Svc(); }
}
