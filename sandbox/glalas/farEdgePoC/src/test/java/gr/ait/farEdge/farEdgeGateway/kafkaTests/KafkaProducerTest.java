package gr.ait.farEdge.farEdgeGateway.kafkaTests;


import gr.ait.farEdge.farEdgeGateway.kafka.KafkaJavaProducer;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


/**
 * Created by glalas-dev on 9/21/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class KafkaProducerTest {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerTest.class);

    @Before
    public void setUp() throws IOException {

    }

    @Test
    public void SynchProducerTest() {
        try {
            logger.info("Starting Synchronous Kafka Producer...");
            KafkaJavaProducer producer = new KafkaJavaProducer();
            producer.runSyncProducer(100,"farEdge-analytics", "Hello FAR EDGE!");
            logger.info("Synchronous Kafka Producer Test ended!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void JSONSyncProducerTest(){
        logger.info("***************KafkaJavaProducer Class Test***************");
        List<JSONObject> jsonObjectList = new ArrayList<>();
        try {
            String jsonString ="[{\"_id\":\"59c35e9c90c5cbaf85571671\",\"index\":0,\"guid\":\"52224156-b274-4303-a247-d27878206ab3\",\"isActive\":false,\"balance\":\"$1,179.77\",\"picture\":\"http://placehold.it/32x32\",\"age\":24,\"eyeColor\":\"brown\",\"name\":\"Iris Willis\",\"gender\":\"female\",\"company\":\"ZBOO\",\"email\":\"iriswillis@zboo.com\",\"phone\":\"+1 (858) 432-3874\",\"address\":\"534 Verona Place, Mayfair, Virgin Islands, 3082\",\"about\":\"Aute duis excepteur laboris velit do commodo cupidatat qui irure. Officia mollit quis laboris occaecat dolor adipisicing tempor labore cillum culpa deserunt excepteur cillum. Do amet in commodo tempor id id in amet irure do incididunt elit. Nostrud duis ex enim sit sunt dolore irure enim esse aute laborum sint sunt. Nulla reprehenderit irure dolore dolore proident ullamco in sint dolor.\\r\\n\",\"registered\":\"2017-09-18T04:50:05 -03:00\",\"latitude\":77.575296,\"longitude\":-51.767817,\"tags\":[\"consectetur\",\"velit\",\"mollit\",\"sit\",\"laboris\",\"aute\",\"non\"],\"friends\":[{\"id\":0,\"name\":\"Rosetta Waters\"},{\"id\":1,\"name\":\"Daugherty Hartman\"},{\"id\":2,\"name\":\"Sasha Montgomery\"}],\"greeting\":\"Hello, Iris Willis! You have 8 unread messages.\",\"favoriteFruit\":\"banana\"},{\"_id\":\"59c35e9c237b0f349d6b3711\",\"index\":1,\"guid\":\"3e3361cc-0fe2-48c2-82ef-0d46201c8ba9\",\"isActive\":true,\"balance\":\"$2,050.27\",\"picture\":\"http://placehold.it/32x32\",\"age\":26,\"eyeColor\":\"blue\",\"name\":\"Socorro Mcpherson\",\"gender\":\"female\",\"company\":\"QUARMONY\",\"email\":\"socorromcpherson@quarmony.com\",\"phone\":\"+1 (954) 460-3263\",\"address\":\"463 Woodrow Court, Coultervillle, New Jersey, 5892\",\"about\":\"Eu ipsum ullamco reprehenderit cillum veniam consectetur proident sit ad. Cupidatat pariatur nisi ex aliquip ut laborum eu. Occaecat non eiusmod labore non ex ipsum excepteur laboris veniam. Qui ut aliquip deserunt anim Lorem eiusmod. Irure aliquip duis nisi dolore magna. Occaecat ullamco laboris ad dolor incididunt fugiat sunt mollit.\\r\\n\",\"registered\":\"2014-10-28T10:20:23 -02:00\",\"latitude\":-9.210177,\"longitude\":-179.282531,\"tags\":[\"et\",\"anim\",\"laborum\",\"consequat\",\"aliquip\",\"mollit\",\"consequat\"],\"friends\":[{\"id\":0,\"name\":\"Pace Jefferson\"},{\"id\":1,\"name\":\"Olson Hayes\"},{\"id\":2,\"name\":\"Ila Gill\"}],\"greeting\":\"Hello, Socorro Mcpherson! You have 2 unread messages.\",\"favoriteFruit\":\"apple\"},{\"_id\":\"59c35e9c229adb4cd57bc7d5\",\"index\":2,\"guid\":\"6d5c1798-4d23-43da-8307-e30d7dc9de82\",\"isActive\":false,\"balance\":\"$3,488.27\",\"picture\":\"http://placehold.it/32x32\",\"age\":39,\"eyeColor\":\"blue\",\"name\":\"Noreen Yang\",\"gender\":\"female\",\"company\":\"ISOTERNIA\",\"email\":\"noreenyang@isoternia.com\",\"phone\":\"+1 (814) 587-2874\",\"address\":\"304 Plymouth Street, Westphalia, North Carolina, 6860\",\"about\":\"Esse incididunt incididunt do ipsum ut. Non quis laboris amet cillum est dolor ex tempor fugiat aliqua fugiat dolor quis. Consequat dolore qui laborum esse aliqua mollit eu excepteur amet minim aliquip ex proident elit.\\r\\n\",\"registered\":\"2014-04-22T02:14:01 -03:00\",\"latitude\":-58.530983,\"longitude\":-119.187483,\"tags\":[\"adipisicing\",\"irure\",\"quis\",\"ad\",\"excepteur\",\"occaecat\",\"veniam\"],\"friends\":[{\"id\":0,\"name\":\"Susanna Norton\"},{\"id\":1,\"name\":\"Ruthie Garcia\"},{\"id\":2,\"name\":\"Christy Fry\"}],\"greeting\":\"Hello, Noreen Yang! You have 6 unread messages.\",\"favoriteFruit\":\"strawberry\"},{\"_id\":\"59c35e9cdb7555b6b42166c4\",\"index\":3,\"guid\":\"da3d2ec4-cc89-410e-8c0e-ad6174bac734\",\"isActive\":true,\"balance\":\"$2,357.35\",\"picture\":\"http://placehold.it/32x32\",\"age\":32,\"eyeColor\":\"green\",\"name\":\"Ayers Wallace\",\"gender\":\"male\",\"company\":\"SQUISH\",\"email\":\"ayerswallace@squish.com\",\"phone\":\"+1 (881) 488-3255\",\"address\":\"246 Coventry Road, Disautel, Minnesota, 8775\",\"about\":\"Enim non officia reprehenderit cillum id eiusmod veniam pariatur magna. Aute est voluptate exercitation reprehenderit excepteur excepteur occaecat id culpa sint eiusmod pariatur. Commodo tempor voluptate ipsum enim commodo exercitation officia ea ipsum do. Nostrud Lorem do nisi non labore nulla excepteur officia laborum nulla. Labore pariatur cillum aute qui esse cupidatat ea nisi ut incididunt. Amet officia nisi enim et.\\r\\n\",\"registered\":\"2017-01-30T05:20:39 -02:00\",\"latitude\":-35.421598,\"longitude\":20.399254,\"tags\":[\"proident\",\"esse\",\"tempor\",\"eiusmod\",\"deserunt\",\"excepteur\",\"do\"],\"friends\":[{\"id\":0,\"name\":\"Vasquez Coffey\"},{\"id\":1,\"name\":\"Fields Gamble\"},{\"id\":2,\"name\":\"Downs Sutton\"}],\"greeting\":\"Hello, Ayers Wallace! You have 8 unread messages.\",\"favoriteFruit\":\"banana\"},{\"_id\":\"59c35e9ca0ef84e43b6d41d6\",\"index\":4,\"guid\":\"5122a0de-5269-46c8-9223-11446d2c94f2\",\"isActive\":true,\"balance\":\"$3,058.87\",\"picture\":\"http://placehold.it/32x32\",\"age\":31,\"eyeColor\":\"brown\",\"name\":\"Brittany Shelton\",\"gender\":\"female\",\"company\":\"TWIIST\",\"email\":\"brittanyshelton@twiist.com\",\"phone\":\"+1 (962) 416-2415\",\"address\":\"896 College Place, Foxworth, Iowa, 2644\",\"about\":\"Labore ut tempor veniam Lorem ut aute duis. Pariatur ullamco anim voluptate non tempor est occaecat amet amet occaecat reprehenderit fugiat irure. Ad adipisicing culpa esse enim voluptate enim magna. Nostrud voluptate mollit ex deserunt. Non nisi ut voluptate do laborum nulla tempor.\\r\\n\",\"registered\":\"2016-03-08T07:44:28 -02:00\",\"latitude\":21.664179,\"longitude\":23.161561,\"tags\":[\"cupidatat\",\"anim\",\"sint\",\"esse\",\"ea\",\"laboris\",\"nisi\"],\"friends\":[{\"id\":0,\"name\":\"Ayala Bond\"},{\"id\":1,\"name\":\"Sharlene Conway\"},{\"id\":2,\"name\":\"Turner Harmon\"}],\"greeting\":\"Hello, Brittany Shelton! You have 4 unread messages.\",\"favoriteFruit\":\"banana\"},{\"_id\":\"59c35e9c472d8b17b56ae26c\",\"index\":5,\"guid\":\"4fc57915-5512-4bff-bc3d-fd7c739b2620\",\"isActive\":false,\"balance\":\"$3,324.01\",\"picture\":\"http://placehold.it/32x32\",\"age\":29,\"eyeColor\":\"blue\",\"name\":\"Alana Snider\",\"gender\":\"female\",\"company\":\"OVERFORK\",\"email\":\"alanasnider@overfork.com\",\"phone\":\"+1 (925) 545-3029\",\"address\":\"780 Taaffe Place, Weeksville, Marshall Islands, 5097\",\"about\":\"Proident sint ex in duis nisi cupidatat. Nisi deserunt consectetur commodo nulla Lorem sint ex. Laboris esse eu esse ad.\\r\\n\",\"registered\":\"2014-10-31T10:59:54 -02:00\",\"latitude\":-32.97744,\"longitude\":156.072116,\"tags\":[\"nulla\",\"laborum\",\"nulla\",\"mollit\",\"pariatur\",\"amet\",\"non\"],\"friends\":[{\"id\":0,\"name\":\"Amelia Oneal\"},{\"id\":1,\"name\":\"Peterson Haney\"},{\"id\":2,\"name\":\"Kathryn Hickman\"}],\"greeting\":\"Hello, Alana Snider! You have 10 unread messages.\",\"favoriteFruit\":\"banana\"},{\"_id\":\"59c35e9cd1ed40d48a21f759\",\"index\":6,\"guid\":\"dedb7dda-281f-47b2-a03b-11981467f21b\",\"isActive\":false,\"balance\":\"$1,956.45\",\"picture\":\"http://placehold.it/32x32\",\"age\":25,\"eyeColor\":\"brown\",\"name\":\"Robles Joyner\",\"gender\":\"male\",\"company\":\"QUILTIGEN\",\"email\":\"roblesjoyner@quiltigen.com\",\"phone\":\"+1 (807) 407-2387\",\"address\":\"999 Bradford Street, Gratton, Kentucky, 2641\",\"about\":\"Consequat occaecat deserunt tempor culpa do sit esse consectetur ipsum cupidatat aute cupidatat velit dolore. Ex sint amet minim nulla est cupidatat in reprehenderit voluptate cupidatat cupidatat. Dolor magna est nostrud aliqua ipsum. Culpa aliqua officia nostrud magna duis est aliqua voluptate. Consequat tempor labore esse ea aliqua Lorem.\\r\\n\",\"registered\":\"2015-03-30T04:09:57 -03:00\",\"latitude\":44.018613,\"longitude\":-164.694979,\"tags\":[\"exercitation\",\"eiusmod\",\"sunt\",\"eu\",\"cupidatat\",\"fugiat\",\"quis\"],\"friends\":[{\"id\":0,\"name\":\"Lyons Schwartz\"},{\"id\":1,\"name\":\"Cabrera Carver\"},{\"id\":2,\"name\":\"Marylou Conrad\"}],\"greeting\":\"Hello, Robles Joyner! You have 3 unread messages.\",\"favoriteFruit\":\"strawberry\"},{\"_id\":\"59c35e9c29cee09cf8bff429\",\"index\":7,\"guid\":\"f18dfea5-d7db-4c3b-9d6b-a28cf20ae765\",\"isActive\":true,\"balance\":\"$3,865.19\",\"picture\":\"http://placehold.it/32x32\",\"age\":25,\"eyeColor\":\"brown\",\"name\":\"Cherry Vega\",\"gender\":\"male\",\"company\":\"POLARIA\",\"email\":\"cherryvega@polaria.com\",\"phone\":\"+1 (807) 463-3306\",\"address\":\"504 Lafayette Avenue, Sims, Vermont, 590\",\"about\":\"Adipisicing sint id consectetur id. Ad deserunt quis pariatur aliqua tempor amet aliquip eu cupidatat id in qui eiusmod. Reprehenderit excepteur adipisicing do ut enim incididunt Lorem laboris veniam ex consequat tempor. Ipsum tempor cupidatat incididunt do pariatur anim. Incididunt aute laborum enim esse sunt sint id. Velit nisi deserunt esse minim.\\r\\n\",\"registered\":\"2014-09-14T01:58:35 -03:00\",\"latitude\":-19.751887,\"longitude\":170.868978,\"tags\":[\"non\",\"enim\",\"laboris\",\"fugiat\",\"adipisicing\",\"veniam\",\"esse\"],\"friends\":[{\"id\":0,\"name\":\"Charity Whitehead\"},{\"id\":1,\"name\":\"Elizabeth Lindsay\"},{\"id\":2,\"name\":\"Lois Hoffman\"}],\"greeting\":\"Hello, Cherry Vega! You have 10 unread messages.\",\"favoriteFruit\":\"apple\"},{\"_id\":\"59c35e9c78f0229a4725bc7b\",\"index\":8,\"guid\":\"6d3dffa3-0e85-4d97-9aae-381f019ee77f\",\"isActive\":true,\"balance\":\"$2,875.38\",\"picture\":\"http://placehold.it/32x32\",\"age\":28,\"eyeColor\":\"blue\",\"name\":\"Kathy Booker\",\"gender\":\"female\",\"company\":\"TEMORAK\",\"email\":\"kathybooker@temorak.com\",\"phone\":\"+1 (845) 533-3790\",\"address\":\"503 Reed Street, Jamestown, Northern Mariana Islands, 6371\",\"about\":\"Incididunt mollit sunt laborum elit anim ut voluptate est consequat eiusmod aliquip velit. Est aute aliquip ipsum voluptate. Eiusmod quis excepteur ad reprehenderit sunt ut anim reprehenderit exercitation. Pariatur officia aliqua sint irure reprehenderit nulla. Deserunt ea sit cillum ea non Lorem proident ipsum aliquip. Incididunt et aliquip nisi duis aliqua tempor magna elit labore Lorem laborum commodo deserunt anim. Reprehenderit nulla eu aliquip cillum irure ad proident.\\r\\n\",\"registered\":\"2014-04-23T09:29:50 -03:00\",\"latitude\":44.617463,\"longitude\":127.561927,\"tags\":[\"enim\",\"veniam\",\"et\",\"pariatur\",\"eu\",\"culpa\",\"irure\"],\"friends\":[{\"id\":0,\"name\":\"Violet Sloan\"},{\"id\":1,\"name\":\"Raymond Hughes\"},{\"id\":2,\"name\":\"Amie Gentry\"}],\"greeting\":\"Hello, Kathy Booker! You have 9 unread messages.\",\"favoriteFruit\":\"apple\"}]";
            JSONArray jsonArray = new JSONArray(jsonString);
            int counter=0;
            int count = jsonArray.length(); // get totalCount of all jsonObjects
            for(int i=0 ; i< count; i++){   // iterate through jsonArray
                JSONObject jsonObject = jsonArray.getJSONObject(i);  // get jsonObject @ i position
                System.out.println("jsonObject " + i + ": " + jsonObject);
                logger.info("Starting Synchronous Kafka Producer...");
                KafkaJavaProducer producer = new KafkaJavaProducer();
                producer.runSyncProducer(1,"farEdge-analytics", jsonObject.toString());
                logger.info("Synchronous Kafka Producer Test ended!");
                counter++;
                logger.info("TOTAL JSONS : {}", counter);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @After
    public void tearDown(){

    }
}
