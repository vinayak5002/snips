const extractHeaderTree = (markdown) => {
  const lines = markdown.split('\n');
  const headerTree = [];

  let stk = [];

  for (let i = 0; i < lines.length; i++) {
    var line = lines[i];
    var header = line.match(/^#+/);

    if (header) {
      const level = header[0].length;
      const title = header.input.split(" ").slice(1).join(" ");

      const newHeader = {
        level: level,
        title: title
      } 

      while (stk.length && stk[stk.length - 1].level >= newHeader.level) {
        const topHeader = stk.pop();
      }

      stk.push(newHeader);
    }
    else {
      console.log(stk, line)
    }
  }
}


const markdown = `
# Header 1
vinayak
## Header 1.1
### Header 1.1.1
vizz
## Header 1.2
### Header 1.2.1
furi
# Header 2`;

const headerTree = extractHeaderTree(markdown);