package demo;
@RestController
public class Web {
    @GetMapping("/things/{thingId}")
    public String one(@PathVariable("id") long id) { return ""; }
    @GetMapping("/things/{id}/parts/{partId:[0-9]+}")
    public String part(@PathVariable("id") long thing, @PathVariable("partId") long part) { return ""; }
}
