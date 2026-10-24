# Reflection

**Name / Andrew ID:**
Steven Mao / smao2

**Recitation group members (Task 2):**

---

### 1. Valid but weak

Pick a property you wrote that passes on the correct implementation but
kills few or no mutants. Why is it still a *valid* property? Describe a
concrete bug (not one of our mutants) that it *would* catch.

I wrote a test to catch if more than 5 colors returned, which is still a valid invariant to test,
but the problem is there are not a lot of mutants it would catch. It is still valid, since
a correct implementation should always return exactly 5 colors, and it could catch
a bug where the code skipped coloring a letter.

### 2. A generator problem, not a property problem

Describe a mutant, from either task, that survived or was flaky because of
your **generator** rather than your property. What did the generator fail to
produce? How did you fix it? Paste the runner output from before and after.

One of the generator problems was that it used all the letters from the alphabets,
but we needed to test a lot of cases where we had duplicate letters, but having all
26 made it hard to test these.

### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the *specification* why that input
exposes the bug.

  ✔ ignoresCounts  killed  by: never credits a letter more times than the secret contains it
      Counterexample: ["AAAAI","IAAIA"]
      AssertionError: expected 2 to be less than or equal to 1

This was killed, since the program expects the credit for a letter to be only as much
as the secret, which is 1. However, the mutant credited I twice, which is incorrect,
as we only have one instance of I in the secret, so this is wrong.

### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.

Invariant:
The autoname feature could use some of these tests. For example, we could verify that
running the /autoname command doesn't change any unrelated things, for instance
we could verify the messages before/after, model, and other data are the exact same.

Conditional:
If the message history is legible (contains english words), then the session name should
also contain only english words. This ensures that the session name after /autoname is
always legible for the user after the conversation.
