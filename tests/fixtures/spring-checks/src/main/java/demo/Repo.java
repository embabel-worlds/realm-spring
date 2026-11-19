package demo;
import org.springframework.data.jpa.repository.*;
public interface Repo extends JpaRepository<Thing, Long> {
    @Query("update Thing t set t.name = ?1")
    int rename(String name);
    @Modifying @Query("delete from Thing t where t.id = ?1")
    int remove(Long id);
    @Query("select * from Thing")
    java.util.List<Thing> all();
    @Query(value = "select * from thing", nativeQuery = true)
    java.util.List<Thing> allNative();
    @Query("select t from Thing t")
    java.util.List<Thing> fine();
}
