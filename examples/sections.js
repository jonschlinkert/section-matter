
var sections = require('..');
var str = `---yaml
title: Don't parse me
---

This page has front matter that shouldn't be parsed.

---foo
title: one
---

Section one.

---bar
title: two
---

Section two, part 1.

---

Section two, part 2.

---

Section two, part 3.

---baz
title: three
---

Section three.
`;

var yaml = require('js-yaml');
var opts = {
  sections: function(section, file) {
    if (typeof section.data === 'string' && section.data.trim() !== '') {
      section.data = yaml.safeLoad(section.data);
    }
    section.content = section.content.trim() + '\n';
    console.log(section);
    console.log();
    console.log();
  }
};

var res = sections(str, opts);
console.log(res);
