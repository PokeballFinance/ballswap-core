pragma solidity 0.6.12;

import "./interfaces/IBallswapPair.sol";
import "./interfaces/IBallswapFactory.sol";

contract Migrator {
    address public master;
    address public oldFactory;
    IBallswapFactory public factory;
    uint256 public notBeforeBlock;
    uint256 public desiredLiquidity = uint256(-1);

    constructor(
        address _master,
        address _oldFactory,
        IBallswapFactory _factory,
        uint256 _notBeforeBlock
    ) public {
        master = _master;
        oldFactory = _oldFactory;
        factory = _factory;
        notBeforeBlock = _notBeforeBlock;
    }

    function migrate(IBallswapPair orig) public returns (IBallswapPair) {
        require(msg.sender == master, "Ballswap::Migrator::migrate::FORBIDDEN");
        require(
            block.number >= notBeforeBlock,
            "Ballswap::Migrator::migrate::TOO_EARLY"
        );
        require(
            orig.factory() == oldFactory,
            "Ballswap::Migrator::migrate::INVALID_FACTORY"
        );
        address token0 = orig.token0();
        address token1 = orig.token1();
        IBallswapPair pair = IBallswapPair(factory.getPair(token0, token1));
        if (pair == IBallswapPair(address(0))) {
            pair = IBallswapPair(factory.createPair(token0, token1));
        }
        uint256 lp = orig.balanceOf(msg.sender);
        if (lp == 0) return pair;
        desiredLiquidity = lp;
        orig.transferFrom(msg.sender, address(orig), lp);
        orig.burn(address(pair));
        pair.mint(msg.sender);
        desiredLiquidity = uint256(-1);
        return pair;
    }
}
