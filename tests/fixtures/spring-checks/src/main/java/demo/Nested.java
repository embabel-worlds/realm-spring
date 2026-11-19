package demo;
@RestController
@RequestMapping("/owners/{ownerId}")
public class Nested {
    @GetMapping("/pets")
    public String pets(@PathVariable("ownerId") long owner) { return ""; }
}
