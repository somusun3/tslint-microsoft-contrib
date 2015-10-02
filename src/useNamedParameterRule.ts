import ErrorTolerantWalker = require('./ErrorTolerantWalker');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Use a named parameter instead: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UseNamedParameterWalker(sourceFile, this.getOptions()));
    }
}

class UseNamedParameterWalker extends ErrorTolerantWalker {

    protected visitElementAccessExpression(node: ts.ElementAccessExpression): void {
        if (node.argumentExpression != null) {
            if (node.argumentExpression.kind === ts.SyntaxKind.NumericLiteral) {
                if (node.expression.getText() === 'arguments') {
                    var failureString = Rule.FAILURE_STRING + '\'' + node.getText() + '\'';
                    var failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                    this.addFailure(failure);
                }
            }
        }
        super.visitElementAccessExpression(node);
    }
}