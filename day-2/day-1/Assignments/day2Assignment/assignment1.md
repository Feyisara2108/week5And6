# Week 5: Day2 Assignment 


## Assignment 1

### Question 1: Where are structs, mappings, and arrays stored?

In Solidity, all 3 (structs, mappings, and arrays) are all **reference types** and are stored based on how they are declared:

#### (a) If declared at contract level:
- They are all stored in **storage** (permanent on the chain)

#### (b) If declared inside a function:
- It must be specified into **memory**, **storage**, or **calldata**

**Storage locations for different data types:**

- **Struct in function:** It's in memory (temporary copy)
- **Struct in storage:** Reference to a state variable
- **Array in function:** Memory
- **Array in storage:** Reference; modifies blockchain state
- **Mapping:** Only stored in storage


### Question 2: How do they behave when executed or called?

**(a) Storage:**
- Permanent
- Expensive
- Can be modified

**(b) Memory:**
- Temporary
- Cheaper
- Can be changed

**(c) Calldata:**
- Temporary
- Read-only
- Can't be modified

**(d) Mapping:**
- Stored in storage
- Cannot know the length



### Question 3: Why don't you need to specify memory or storage with mapping?

**Answer:** Mapping can only live in storage; it can't be copied, they don't have length.


