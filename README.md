<pre>
 _     _ ______  _______ ______  _______ _______ ______  
(_)   (_|____  \(_______|_____ \(_______|_______|______) 
 _     _ ____)  )_____   _____) )_______ _     _ _     _ 
| |   | |  __  (|  ___) |  __  /|  ___  | |   | | |   | |
| |___| | |__)  ) |_____| |  \ \| |   | | |   | | |__/ / 
 \_____/|______/|_______)_|   |_|_|   |_|_|   |_|_____/  
  Uberand
</pre>

## A quantum random number generator for node.js.
A wrapper of Chris Bumgardner's qrand ([https://github.com/cbumgard/node-qrand](https://github.com/cbumgard/node-qrand)) with some added functionality.

## Caching
Instead of making a request each time you need a random number, a cache of 1000 (by default) random octets is kept and used when retieving random numbers. When the cache runs out, new octets are retrieved. This quickens processing by cutting down on network requests.

To change the amount added to the cache with each request (max 1024), simply change *uberand.cacheSize*.

## Usage
### uberand.hex(size,callback)
Retrieves a hexadecial of the octet length *size*.

    uberand.hex(4, function(err, hex) { 
      //hex = 8cf507d3
    });

###uberand.int(bits,callback)
Retrieves an integer value of bit size *bits*. Valid bit sizes are 8, 16, and 32.

    uberand.int(32, function(err, num) { 
      //num = 1735374832
    });

###uberand.percent(callback)
Retrieves a value between 0 and 1, with 2 points of percision.

    uberand.percent(function(err, per) { 
      //per = 0.31
    });
