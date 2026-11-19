package demo;
import org.springframework.stereotype.Service;
@Service
public class Svc {
    @Value("${app.name")
    private String broken;
    @Value("app.title")
    private String literal;
    @Value("${app.title:x.y}")
    private String ok;
    @Value("classpath:data.json")
    private String resource;
    @Autowired
    private static Repo repo;
    @Scheduled(fixedRate = 1000)
    public void tick(String arg) { }
    @Scheduled(fixedRate = 1000)
    public void tock() { }
    @Async
    public String compute() { return "x"; }
    @Async
    public CompletableFuture<String> computeOk() { return null; }
    @Async
    public void fire() { }
}
