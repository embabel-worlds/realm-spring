package demo;
@Configuration
public class Cfg {
    @Bean
    private Svc hidden() { return new Svc(); }
    @Bean
    final Svc sealed() { return new Svc(); }
    @Bean
    static Svc fineStatic() { return new Svc(); }
    @Bean
    Svc fine(final Repo repo) { return new Svc(); }
}
